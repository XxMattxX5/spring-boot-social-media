"use client";
import React from "react";
import TimeAgo from "react-timeago";

type Props = {
  date: Date;
};

const TimeAgoDate = ({ date }: Props) => {
  return <TimeAgo date={date} />;
};

export default TimeAgoDate;
