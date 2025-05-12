"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  {
    name: "1월",
    기관: 120,
    이용자: 220,
  },
  {
    name: "2월",
    기관: 150,
    이용자: 270,
  },
  {
    name: "3월",
    기관: 170,
    이용자: 290,
  },
  {
    name: "4월",
    기관: 180,
    이용자: 310,
  },
  {
    name: "5월",
    기관: 200,
    이용자: 350,
  },
  {
    name: "6월",
    기관: 220,
    이용자: 380,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip />
        <Bar
          dataKey="기관"
          fill="#4f46e5"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
        <Bar
          dataKey="이용자"
          fill="#8884d8"
          radius={[4, 4, 0, 0]}
          className="fill-primary/30"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
