import { ConfigProvider } from "antd";
import Navbar from "./mainpage/components/Navbar";
import MainPage from "./mainpage/page";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#8b4d0b",
          colorSuccess: "#0069fc",
          colorWarning: "#f5222d",
          colorError: "#ff0004",
          borderRadius: 4,
          boxShadow: "none",
          fontFamily: "'Satoshi', sans-serif",
        },
        components: {
          Button: {
            paddingBlock: 22,
          },
          Select: {
            controlHeight: 46,
          },
          Input: {
            paddingInline: 24,
            controlHeight: 46,
          },
        },
      }}
    >
      <Toaster position="top-right" />
      <Navbar />
      <MainPage />
    </ConfigProvider>
  );
}
