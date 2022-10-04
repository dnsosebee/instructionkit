import { Handle, Position } from "reactflow";
import { Flow } from "../../model/core/flow";
import { Mutate } from "../app";
import { FlowEditor } from "./flowEditor";

export interface FlowNodeProps {
  mutate: Mutate;
  flow: Flow;
}

function FlowNode({ data: { mutate, flow } }: { data: FlowNodeProps }) {
  return (
    <div className="border rounded-3xl overflow-hidden bg-blue-200 shadow-2xl">
      <Handle type="target" position={Position.Top} />
      <div className="drag-handle h-10"></div>
      <div className="flex">
        <div className="drag-handle w-10"></div>
        <FlowEditor flow={flow} mutate={mutate} />
        <div className="drag-handle w-10"></div>
      </div>
      <div className="drag-handle h-10"></div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{ left: 10 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="c"
        style={{ position: "absolute", right: 20 }}
      />
    </div>
  );
}

export default FlowNode;
