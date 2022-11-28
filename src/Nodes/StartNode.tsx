import React, { useContext } from 'react';
import AddButton from '../AddButton';
import { BuilderContext, NodeContext } from '../contexts';
import DefaultNode from '../DefaultNode';
import { getRegisterNode } from '../utils';

const StartNode: React.FC = () => {
  const { registerNodes, nodes, customAddIcon } = useContext(BuilderContext);

  const node = useContext(NodeContext);

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  return (
    <div
      className={`flow-builder-node flow-builder-start-node ${
        registerNode?.className || ''
      }`}
    >
      <div className="flow-builder-node__content">
        <Component node={node} nodes={nodes} />
      </div>

      <AddButton icon={customAddIcon} />
    </div>
  );
};

export default StartNode;
