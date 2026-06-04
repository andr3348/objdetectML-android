import type { Detection } from "@/types/Detection";
import { useCallback, useState } from "react";
import { useTensorflowModel } from "react-native-fast-tflite";
import type { Frame } from "react-native-vision-camera";
import { useFrameOutput } from "react-native-vision-camera";
import { runOnJS } from "react-native-worklets";

// Sequential COCO labels (0-based, matches TFLite model output).
// Gaps in COCO IDs are filled with placeholders.
const COCO_LABELS = [
  "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train",
  "truck", "boat", "traffic light", "fire hydrant", null, "stop sign",
  "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep", "cow",
  "elephant", "bear", "zebra", "giraffe", null, "backpack", "umbrella",
  null, null, "handbag", "tie", "suitcase", "frisbee", "skis",
  "snowboard", "sports ball", "kite", "baseball bat", "baseball glove",
  "skateboard", "surfboard", "tennis racket", "bottle", null, "wine glass",
  "cup", "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich",
  "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake",
  "chair", "couch", "potted plant", "bed", null, "dining table",
  null, null, "toilet", null, "tv", "laptop", "mouse", "remote",
  "keyboard", "cell phone", "microwave", "oven", "toaster", "sink",
  "refrigerator", null, "book", "clock", "vase", "scissors",
  "teddy bear", "hair drier", "toothbrush",
];

const CONFIDENCE_THRESHOLD = 0.4;
const MODEL_INPUT_SIZE = 320;

export function useObjectDetection() {
  const [detections, setDetections] = useState<Detection[]>([]);

  const tfModel = useTensorflowModel(require("../../assets/detect.tflite"), []);
  const model = tfModel.state === "loaded" ? tfModel.model : undefined;

  const updateDetections = useCallback((raw: Detection[]) => {
    setDetections(raw);
  }, []);

  const frameOutput = useFrameOutput({
    pixelFormat: "rgb",
    targetResolution: {
      width: MODEL_INPUT_SIZE,
      height: MODEL_INPUT_SIZE,
    },
    dropFramesWhileBusy: true,
    onFrame(frame: Frame) {
      "worklet";

      if (model == null) {
        frame.dispose();
        return;
      }

      const src = frame.getPixelBuffer();
      const srcW = frame.width;
      const srcH = frame.height;

      const srcArr = new Uint8Array(src);
      const dstArr = new Uint8Array(MODEL_INPUT_SIZE * MODEL_INPUT_SIZE * 3);

      for (let dy = 0; dy < MODEL_INPUT_SIZE; dy++) {
        for (let dx = 0; dx < MODEL_INPUT_SIZE; dx++) {
          const sx = (dx / MODEL_INPUT_SIZE) * srcW;
          const sy = (dy / MODEL_INPUT_SIZE) * srcH;
          const ix = Math.min(srcW - 1, Math.max(0, Math.round(sx)));
          const iy = Math.min(srcH - 1, Math.max(0, Math.round(sy)));

          const si = (iy * srcW + ix) * 4;
          const di = (dy * MODEL_INPUT_SIZE + dx) * 3;

          dstArr[di] = srcArr[si + 2];
          dstArr[di + 1] = srcArr[si + 1];
          dstArr[di + 2] = srcArr[si + 0];
        }
      }

      const outputs = model.runSync([dstArr.buffer as ArrayBuffer]);

      const boxesData = new Float32Array(outputs[0]);
      const classesData = new Float32Array(outputs[1]);
      const scoresData = new Float32Array(outputs[2]);
      const count = Math.round(new Float32Array(outputs[3])[0]);

      const result: Detection[] = [];

      for (let i = 0; i < count; i++) {
        const confidence = scoresData[i];
        if (confidence < CONFIDENCE_THRESHOLD) continue;

        const classIdx = Math.round(classesData[i]);
        const label = COCO_LABELS[classIdx] ?? "unknown";

        result.push({
          label,
          confidence,
          yMin: boxesData[i * 4 + 0],
          xMin: boxesData[i * 4 + 1],
          yMax: boxesData[i * 4 + 2],
          xMax: boxesData[i * 4 + 3],
        });
      }

      runOnJS(updateDetections)(result);
      frame.dispose();
    },
  });

  return { detections, frameOutput, isModelLoaded: model != null };
}
