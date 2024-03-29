import React from 'react'
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/react";

interface CardTemplateProps {
  message?: string;
  sender?: string;
  id?: string;
  timestamp: string | Date;
  chatWith?: string;
  alignment?: string;
}

export default function CardTemplate({chatWith, message, sender, id, timestamp, alignment}: CardTemplateProps) {
  const isSelf = sender;
  const cardStyles = isSelf ? "bg-blue-500 text-white" : "bg-gray-100 text-black";
  const alignmentStyles = isSelf ? "self-end" : "self-start";

  return (
    <Card className={`${cardStyles} ${alignmentStyles} max-w-xs md:max-w-md mx-2 my-1 rounded-lg`}>
      <CardBody>
        <p className="p-2">{message ? message : chatWith}</p>
      </CardBody>
    </Card>
  )
}
