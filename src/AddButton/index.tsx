import { Popover } from 'antd';
import React, { useContext, useState } from 'react';
import ActionButton from '../ActionButton';
import { BuilderContext, NodeContext } from '../contexts';
import DropButton from '../DropButton';
import { useAction } from '../hooks';
import { SplitLine } from '../Lines';
import {
  getIsBranchNode,
  getIsConditionNode,
  getIsEndNode,
  getIsStartNode,
  getRegisterNode,
} from '../utils';

import AddBranchIcon from '../icons/add-branch.svg';
import AddIcon from '../icons/add-button.svg';
import AddNormalIcon from '../icons/add-normal.svg';
import './index.less';

interface IProps {
  icon?: React.ReactNode;
}

const AddNodeButton: React.FC<IProps> = (props) => {
  const {
    registerNodes,
    nodes,
    readonly,
    dragType,
    DropComponent = DropButton,
  } = useContext(BuilderContext);

  const { icon } = props;
  const node = useContext(NodeContext);

  const { addNode } = useAction();

  const [visible, setVisible] = useState(false);

  const registerNode = getRegisterNode(registerNodes, node.type);
  const AddableComponent = registerNode?.addableComponent;
  const addableNodeTypes = registerNode?.addableNodeTypes;

  const droppable =
    dragType &&
    !getIsConditionNode(registerNodes, dragType) &&
    (Array.isArray(addableNodeTypes)
      ? addableNodeTypes.includes(dragType)
      : true);

  const options = registerNodes.filter(
    (item) =>
      !getIsStartNode(registerNodes, item.type) &&
      !getIsEndNode(registerNodes, item.type) &&
      !getIsConditionNode(registerNodes, item.type) &&
      (Array.isArray(addableNodeTypes)
        ? addableNodeTypes.includes(item.type)
        : true),
  );

  const handleAddNode = (newNodeType: string) => {
    addNode(newNodeType);
    setVisible(false);
  };

  const handleDrop = () => {
    addNode(dragType);
  };

  const addableOptions = AddableComponent ? (
    <AddableComponent node={node} nodes={nodes} add={handleAddNode} />
  ) : (
    <>
      {options.map((item) => {
        const registerNode = getRegisterNode(registerNodes, item.type);
        const defaultIcon = getIsBranchNode(registerNodes, item.type)
          ? AddBranchIcon
          : AddNormalIcon;
        return (
          <div
            className="flow-builder-addable-node-item"
            key={item.type}
            onClick={() => handleAddNode(item.type)}
          >
            <span className="flow-builder-addable-node-icon">
              {registerNode?.addIcon || <img src={defaultIcon} />}
            </span>

            <span>{item.name}</span>
          </div>
        );
      })}
    </>
  );

  return (
    <>
      <SplitLine />
      {!readonly && options.length > 0 ? (
        droppable ? (
          <DropComponent onDrop={handleDrop} />
        ) : (
          <Popover
            visible={visible}
            onVisibleChange={setVisible}
            overlayClassName="flow-builder-addable-nodes"
            placement="rightTop"
            trigger={['click']}
            content={addableOptions}
            getPopupContainer={(triggerNode) => triggerNode as HTMLElement}
          >
            <div onClick={(e) => e.stopPropagation()}>
              {icon || <ActionButton icon={AddIcon} />}
            </div>
          </Popover>
        )
      ) : null}

      <SplitLine />
    </>
  );
};

export default AddNodeButton;
