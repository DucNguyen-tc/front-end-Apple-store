import React, { useState, useContext } from "react";
import { register, login } from "../../Api/authApi";
import { UserContext } from "../../stores/UserContext";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Checkbox, Divider } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  FacebookOutlined,
  GoogleOutlined,
  TwitterOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form] = Form.useForm();
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    if (!isLogin) {
      try {
        await register({
          fullName: values.username,
          password: values.password,
          email: values.email,
          phone: values.phone,
        });
        alert("Đăng ký thành công");
        setIsLogin(true);
      } catch (error) {
        alert("Đăng ký thất bại");
      }
    } else {
      try {
        const response = await login({
          email: values.email,
          password: values.password,
        });
        alert("Đăng nhập thành công");
        setUser(response.user);
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));
        navigate("/");
      } catch (error) {
        alert("Đăng nhập thất bại");
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    form.resetFields();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="flex w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
        {/* Left side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-green-300 opacity-20"></div>
          <img
            src="/images/Login.png"
            alt="Login illustration"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6"></div>
              <Title level={2} className="font-bold text-gray-800">
                {isLogin ? "Sign In to Account" : "Create New Account"}
              </Title>
              <Paragraph className="text-gray-500">
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Fill the form to create your account"}
              </Paragraph>
            </div>

            <Form
              form={form}
              layout="vertical"
              name="auth_form"
              onFinish={handleSubmit}
              className="space-y-4"
            >
              {/* Luôn hiển thị trường email */}
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter your email address",
                  },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Email Address"
                  size="large"
                  className="rounded-lg h-12"
                />
              </Form.Item>

              {/* Chỉ hiển thị username khi đăng ký */}
              {!isLogin && (
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Please enter your username" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Username"
                    size="large"
                    className="rounded-lg h-12"
                  />
                </Form.Item>
              )}

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Password"
                  size="large"
                  className="rounded-lg h-12"
                />
              </Form.Item>

              {!isLogin && (
                <Form.Item
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined className="text-gray-400" />}
                    placeholder="Phone Number"
                    size="large"
                    className="rounded-lg h-12"
                  />
                </Form.Item>
              )}

              {isLogin && (
                <div className="flex justify-between items-center mb-6">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  className="h-12 font-medium text-lg bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </Button>
              </Form.Item>

              <Divider plain>
                <span className="text-gray-400">or continue with</span>
              </Divider>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <Button
                  icon={<GoogleOutlined />}
                  size="large"
                  className="flex items-center justify-center h-12 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                />
                <Button
                  icon={<FacebookOutlined />}
                  size="large"
                  className="flex items-center justify-center h-12 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                />
                <Button
                  icon={<TwitterOutlined />}
                  size="large"
                  className="flex items-center justify-center h-12 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                />
              </div>

              <div className="text-center mt-8">
                <span className="text-gray-600">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </span>
                <Button
                  type="link"
                  onClick={toggleForm}
                  className="font-medium text-indigo-600 hover:text-indigo-800"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
