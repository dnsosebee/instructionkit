import { useCallback } from "react";
import { Handle, Position } from "reactflow";

function TextUpdaterNode() {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="border" />
      </div>
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

export default TextUpdaterNode;
