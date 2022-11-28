import React, { useContext } from 'react';
import AddButton from '../AddButton';
import Arrow from '../Arrow';
import { BuilderContext, NodeContext } from '../contexts';
import DefaultNode from '../DefaultNode';
import { useAction } from '../hooks';
import RemoveButton from '../RemoveButton';
import { getRegisterNode } from '../utils';

const CommonNode: React.FC = () => {
  const { readonly, registerNodes, nodes, beforeNodeClick, customAddIcon } =
    useContext(BuilderContext);

  const node = useContext(NodeContext);

  const { clickNode, removeNode } = useAction();

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  const handleNodeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await beforeNodeClick?.(node);
      clickNode();
    } catch (error) {
      console.log('node click error', error);
    }
  };

  return (
    <div className={`flow-builder-node ${registerNode?.className || ''}`}>
      <Arrow />
      <div className="flow-builder-node__content" onClick={handleNodeClick}>
        <Component
          readonly={readonly}
          node={node}
          nodes={nodes}
          remove={removeNode}
        />

        <RemoveButton />
      </div>

      <AddButton icon={customAddIcon} />
    </div>
  );
};

export default CommonNode;
