import { Tag } from 'antd';
import React from 'react';

interface QuestionHadHelpLabelProps {
  hadHelp: boolean;
}

const QuestionHadHelpLabel = ({ hadHelp }: QuestionHadHelpLabelProps) => {
  if (hadHelp) return <Tag color="geekblue">Med hjælpemidler</Tag>;
  return <Tag>Uden hjælpemidler</Tag>;
};

export default QuestionHadHelpLabel;
