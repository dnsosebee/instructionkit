import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import { Mutate } from "../../../app";
import { Flow } from "../../../flow";
import { FlowEditor } from "../../flowEditor";

export interface FlowNodeProps {
  mutate: Mutate;
  flow: Flow;
}

function FlowNode({ data: { mutate, flow } }: { data: FlowNodeProps }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
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
