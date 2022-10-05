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
    <div className="border overflow-hidden bg-zinc-50 shadow-2xl p-4">
      <Handle type="target" position={Position.Top} />
      <FlowEditor flow={flow} mutate={mutate} />
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
