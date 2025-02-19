import { createRoot } from "react-dom/client";
import { createApp } from "./base";

const rootElement = document.getElementById('root')
if(!rootElement) throw Error('No root element found')

const root = createRoot(rootElement)
root.render(createApp())