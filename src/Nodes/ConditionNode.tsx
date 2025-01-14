import React, { useContext, useMemo } from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import AddButton from '../AddButton';
import Arrow from '../Arrow';
import { BuilderContext, NodeContext } from '../contexts';
import DefaultNode from '../DefaultNode';
import { useAction } from '../hooks';
import type { INode, IRender } from '../index';
import { CoverLine, FillLine, SplitLine } from '../Lines';
import RemoveButton from '../RemoveButton';
import { getRegisterNode } from '../utils';

interface IProps {
  parentNode?: INode;
  conditionIndex: number;
  renderNext: (params: IRender) => React.ReactNode;
}

const ConditionNode: React.FC<IProps> = (props) => {
  const { parentNode, conditionIndex, renderNext } = props;

  const {
    layout,
    spaceX,
    spaceY,
    readonly,
    registerNodes,
    nodes,
    beforeNodeClick,
    sortable,
    sortableAnchor,
    customAddIcon,
  } = useContext(BuilderContext);

  const node = useContext(NodeContext);

  const { clickNode, removeNode } = useAction();

  const conditionCount = Array.isArray(parentNode?.children)
    ? parentNode?.children.length || 0
    : 0;

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  const ConditionDragHandle = useMemo(
    () =>
      SortableHandle(() => {
        return (
          <span className="flow-builder-sortable-handle">
            {sortableAnchor || ':::'}
          </span>
        );
      }),
    [sortableAnchor],
  );

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
    <div
      className={`flow-builder-node flow-builder-condition-node ${
        registerNode?.className || ''
      }`}
      style={{
        padding: layout === 'vertical' ? `0 ${spaceX}px` : `${spaceY}px 0`,
      }}
    >
      {conditionCount > 1 ? (
        <>
          <CoverLine
            full={conditionIndex !== 0 && conditionIndex !== conditionCount - 1}
            className={`cover-condition-start ${
              conditionIndex === 0
                ? 'cover-first'
                : conditionIndex === conditionCount - 1
                ? 'cover-last'
                : ''
            }`}
          />
          <CoverLine
            full={conditionIndex !== 0 && conditionIndex !== conditionCount - 1}
            className={`cover-condition-end ${
              conditionIndex === 0
                ? 'cover-first'
                : conditionIndex === conditionCount - 1
                ? 'cover-last'
                : ''
            }`}
          />
        </>
      ) : null}

      <SplitLine />

      <Arrow />

      <div className="flow-builder-node__content" onClick={handleNodeClick}>
        {sortable ? <ConditionDragHandle /> : null}
        <Component
          readonly={readonly}
          node={node}
          nodes={nodes}
          remove={removeNode}
        />
        <RemoveButton />
      </div>

      <AddButton icon={customAddIcon} />

      {Array.isArray(node.children)
        ? renderNext({
            nodes: node.children,
            parentNode: node,
          })
        : null}

      <FillLine />
    </div>
  );
};

export default ConditionNode;
