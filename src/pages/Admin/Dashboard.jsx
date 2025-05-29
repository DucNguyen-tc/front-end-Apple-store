import { Line } from "@ant-design/charts";
import { Calendar, Card, Avatar, Button } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useState } from "react";

export default function Dashboard() {
  // Data for Growth Line Chart
  const skillGrowthData = [
    { month: "Jan", value: 20 },
    { month: "Feb", value: 28 },
    { month: "Mar", value: 35 },
    { month: "Apr", value: 45 },
    { month: "May", value: 55 },
    { month: "Jun", value: 65 },
    { month: "Jul", value: 80 },
    { month: "Aug", value: 90 },
    { month: "Sep", value: 100 },
    { month: "Oct", value: 110 },
    { month: "Nov", value: 120 },
    { month: "Dec", value: 130 },
  ];

  const skillGrowthConfig = {
    data: skillGrowthData,
    xField: "month",
    yField: "value",
    smooth: true,
    color: "#3b82f6",
    area: {},
    point: {
      size: 5,
      shape: "circle",
      style: {
        fill: "#fff",
        stroke: "#3b82f6",
        lineWidth: 2,
      },
    },
    xAxis: {
      label: {
        style: {
          fill: "#d1d5db",
        },
      },
      line: {
        style: {
          stroke: "#374151",
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: "#d1d5db",
        },
      },
      grid: {
        line: {
          style: {
            stroke: "#374151",
            lineDash: [4, 4],
          },
        },
      },
    },
    tooltip: {
      domStyles: {
        "g2-tooltip": {
          background: "#1f2937",
          color: "#fff",
        },
      },
    },
    height: 300,
  };

  // Data for Bar Chart
  const barData = [
    { category: "Posts", value: 194 },
    { category: "Projects", value: 554 },
    { category: "Files", value: 121 },
    { category: "Followers", value: 12800 },
    { category: "Following", value: 1100 },
  ];

  const barConfig = {
    data: barData,
    xField: "value",
    yField: "category",
    barWidthRatio: 0.6,
    color: "#3b82f6", // blue-500
    xAxis: {
      label: {
        style: {
          fill: "#d1d5db", // Tailwind gray-300
          fontSize: 14,
        },
        formatter: (v) => (Number(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : v),
      },
      grid: {
        line: {
          style: {
            stroke: "#374151", // Tailwind gray-700
            lineDash: [4, 4],
          },
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: "#d1d5db",
          fontSize: 15,
          fontWeight: 500,
        },
      },
    },
    barStyle: {
      radius: [8, 8, 8, 8],
    },
    tooltip: {
      domStyles: {
        "g2-tooltip": {
          background: "#1f2937", // Tailwind gray-800
          color: "#fff",
        },
      },
    },
    height: 340,
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Avatar size={64} icon={<UserOutlined />} className="bg-blue-500" />
            <div>
              <h1 className="text-3xl font-bold">Duc dep chai</h1>
              <p className="text-blue-400">I LOVE PTITHCM</p>
            </div>
          </div>
          <div className="space-x-4">
            <Button
              type="primary"
              icon={<MessageOutlined />}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Message
            </Button>
            <Button
              type="default"
              icon={<SettingOutlined />}
              className="text-white border-gray-600 hover:bg-gray-700"
            >
              Settings
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Charts */}
          <div className="space-y-6">
            <Card
              title="Skill Growth"
              className="bg-gray-800 border-none rounded-lg shadow-lg"
            >
              <Line {...skillGrowthConfig} style={{ height: 300 }} />
            </Card>
            <Card
              title="Weather Forecast"
              className="bg-gray-800 border-none rounded-lg shadow-lg"
              style={{ marginTop: 16 }}
            >
              <div className="flex items-center space-x-6">
                <div className="flex flex-col items-center">
                  <span className="text-4xl">🌤️</span>
                  <span className="text-2xl font-bold mt-2">31°C</span>
                  <span className="text-blue-300">Ho Chi Minh City</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-300">
                    <div className="flex flex-col items-center">
                      <span>Mon</span>
                      <span>☀️</span>
                      <span>32°C</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>Tue</span>
                      <span>🌤️</span>
                      <span>31°C</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>Wed</span>
                      <span>🌧️</span>
                      <span>28°C</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>Thu</span>
                      <span>⛅</span>
                      <span>30°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Middle Column: Calendar & Images */}
          <div className="space-y-6">
            <Card
              title="Schedule"
              className="bg-gray-800 border-none rounded-lg shadow-lg"
            >
              <Calendar
                fullscreen={false}
                className="bg-gray-800 text-white"
                headerRender={({ value, onChange }) => (
                  <div className="flex justify-between items-center p-4">
                    <h2 className="text-lg font-semibold">
                      {value.format("MMMM YYYY")}
                    </h2>
                  </div>
                )}
              />
            </Card>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <img
                src="https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/meme-meo-4.jpg"
                alt="Design Work"
                className="rounded-lg shadow-lg object-cover h-40 w-full"
              />
              <img
                src="https://phongvu.vn/cong-nghe/wp-content/uploads/2024/09/Meme-meo-bua-21.jpg"
                alt="Illustration"
                className="rounded-lg shadow-lg object-cover h-40 w-full"
              />
            </div>
          </div>

          {/* Right Column: Tasks & Quick Links */}
          <div className="space-y-6">
            <Card
              title="Tasks"
              className="bg-gray-800 border-none rounded-lg shadow-lg"
            >
              <div className="space-y-4">
                {[
                  { time: "10:20", task: "Call conference with a New" },
                  { time: "10:30", task: "Presentation Demo Ecological" },
                  { time: "10:50", task: "Call with PR Manager" },
                  { time: "11:10", task: "Interview with a new UI/UX" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-700 rounded-xl shadow transition hover:bg-gray-600"
                  >
                    <div>
                      <p className="text-blue-400 font-semibold text-sm">
                        {item.time}
                      </p>
                      <p className="text-gray-200 text-base">{item.task}</p>
                    </div>
                    <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-green-200 shadow" />
                  </div>
                ))}
              </div>
            </Card>
            <Card
              title="Quick Links"
              className="bg-gray-800 border-none rounded-lg shadow-lg"
              style={{ marginTop: 16 }}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Files", icon: <UserOutlined /> },
                  { label: "Calendar", icon: <UserOutlined /> },
                  { label: "Tasks", icon: <UserOutlined /> },
                  { label: "Team", icon: <UserOutlined /> },
                ].map((item, index) => (
                  <Button
                    key={index}
                    className="flex flex-col items-center justify-center p-5 bg-gray-700 rounded-xl hover:bg-blue-500 transition text-white shadow gap-2"
                    style={{ minHeight: 80 }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
