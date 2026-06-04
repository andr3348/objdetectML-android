import { Detection } from "@/types/Detection";
import { useCallback, useState } from "react";
import { useTensorflowModel } from "react-native-fast-tflite";
import type { Frame } from "react-native-vision-camera";
import { useFrameOutput } from "react-native-vision-camera";
import { runOnJS } from "react-native-worklets";

const COCO_LABELS = [
  "person",
  "bicycle",
  "car",
  "motorcycle",
  "airplane",
  "bus",
  "train",
  "truck",
  "boat",
  "traffic light",
  "fire hydrant",
  "stop sign",
  "parking meter",
  "bench",
  "bird",
  "cat",
  "dog",
  "horse",
  "sheep",
  "cow",
  "elephant",
  "bear",
  "zebra",
  "giraffe",
  "backpack",
  "umbrella",
  "handbag",
  "tie",
  "suitcase",
  "frisbee",
  "skis",
  "snowboard",
  "sports ball",
  "kite",
  "baseball bat",
  "baseball glove",
  "skateboard",
  "surfboard",
  "tennis racket",
  "bottle",
  "wine glass",
  "cup",
  "fork",
  "knife",
  "spoon",
  "bowl",
  "banana",
  "apple",
  "sandwich",
  "orange",
  "broccoli",
  "carrot",
  "hot dog",
  "pizza",
  "donut",
  "cake",
  "chair",
  "couch",
  "potted plant",
  "bed",
  "dining table",
  "toilet",
  "tv",
  "laptop",
  "mouse",
  "remote",
  "keyboard",
  "cell phone",
  "microwave",
  "oven",
  "toaster",
  "sink",
  "refrigerator",
  "book",
  "clock",
  "vase",
  "scissors",
  "teddy bear",
  "hair drier",
  "toothbrush",
];

const CONFIDENCE_THRESHOLD = 0.45;
const MODEL_INPUT_SIZE = 300;

export function useObjectDetection() {
  const [detections, setDetections] = useState<Detection[]>([]);

  const tfModel = useTensorflowModel(require("../../assets/detect.tflite"), []); // Ensure the model is only loaded once. Uses CPU
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

      const input = dstArr.buffer as ArrayBuffer;
      const outputs = model.runSync([input]);

      const boxes = outputs[0] as unknown as number[];
      const classes = outputs[1] as unknown as number[];
      const scores = outputs[2] as unknown as number[];
      const count = Math.round((outputs[3] as unknown as number[])[0]);

      const result: Detection[] = [];

      for (let i = 0; i < count; i++) {
        const confidence = scores[i];
        if (confidence < CONFIDENCE_THRESHOLD) continue;

        const classIdx = Math.round(classes[i]);
        const label = COCO_LABELS[classIdx - 1] ?? "unknown";

        result.push({
          label,
          confidence,
          yMin: boxes[i * 4 + 0],
          xMin: boxes[i * 4 + 1],
          yMax: boxes[i * 4 + 2],
          xMax: boxes[i * 4 + 3],
        });
      }

      runOnJS(updateDetections)(result);
      frame.dispose();
    },
  });

  return { detections, frameOutput, isModelLoaded: model != null };
}
