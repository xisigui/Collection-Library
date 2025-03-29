import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogImage,
  MorphingDialogContainer,
} from "@/components/core/morphing-dialog";
import { XIcon } from "lucide-react";
import { ProgressiveBlur } from "@/components/core/progressive-blur";

export function PreviewImageDialog() {
  return (
    <MorphingDialog
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
    >
      <MorphingDialogTrigger>
        <div className="relative my-4 aspect-square w-[300px] overflow-hidden rounded-[4px]">
          <MorphingDialogImage
            src="https://cdn.cosmos.so/c4653e73-d082-42e9-87d2-5377d7e6a7f3?format=jpeg"
            alt="Sony Style Store in the Sony Center complex - Berlin, Germany (2000)"
            className="absolute inset-0"
          />
          <ProgressiveBlur
            className="pointer-events-none absolute bottom-0 left-0 h-[75%] w-full"
            blurIntensity={1}
          />
          <div className="absolute bottom-0 left-0">
            <div className="flex flex-col items-start gap-0 px-5 py-4">
              <p className="text-base font-medium text-white">
                Benjamin Spiers
              </p>
              <span className="mb-2 text-base text-zinc-300">
                Moonlight 2023
              </span>
            </div>
          </div>
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative">
          <MorphingDialogImage
            src="https://cdn.cosmos.so/c4653e73-d082-42e9-87d2-5377d7e6a7f3?format=jpeg"
            alt="Sony Style Store in the Sony Center complex - Berlin, Germany (2000)"
            className="aspect-square h-auto w-full max-w-[90vw] rounded-[4px] object-cover lg:h-[90vh]"
          />
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed right-6 top-6 h-fit w-fit rounded-full bg-white p-1"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.2, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
