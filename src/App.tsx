import "./App.css";
import { PreviewImageDialog } from "./components/preview-image";

function App() {
  // @ts-ignore
  window.electron.getAllItems();
  return (
    <>
      <div className="m-screen h-screen p-3">
        <div className="grid grid-cols-2 gap-2 w-full h-full ">
          <div className="flex items-center justify-center">
            <PreviewImageDialog />
          </div>
          <div className="flex items-center justify-center">
            <PreviewImageDialog />
          </div>
          <div className="flex items-center justify-center">
            <PreviewImageDialog />
          </div>
          <div className="flex items-center justify-center">
            <PreviewImageDialog />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
