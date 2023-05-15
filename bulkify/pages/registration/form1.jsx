import React from 'react';
import Link from 'next/link';
import { Form, Input } from 'antd';


export default function form1() {
  return (
                    <Form
                        className="ps-form--account"
                        >
                        <ul className="ps-tab-list">
                            <li className="active">
                                <Link href="#">
                                    <a>Register As a Seller</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/registration/vendorslogin">
                                    <a>Already A Seller</a>
                                </Link>
                            </li>
                        </ul>
                        <div className="ps-tab active" id="sign-in">
                            <div className="ps-form__content">
                                <h5>Setup Your Account</h5>
                                <div className="form-group">
                                    <Form.Item
                                        name="firstname"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your First Name!',
                                            },
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            placeholder="First Name"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="lastname"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your Last Name!',
                                            },
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            placeholder="Last Name"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your Email!',
                                            },
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            placeholder="Email"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="companyname"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your Company Name!',
                                            },
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            placeholder="Company Name"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="country"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your Registered Country!',
                                            },
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            placeholder="Company Registered Country"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="phonenumber"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your Phone Number!',
                                            },
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            placeholder="Phone Number"
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group form-forgot">
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your password!',
                                            },
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="password"
                                            placeholder="Password..."
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group submit">
                                    <button
                                        type="next"
                                        className="ps-btn ps-btn--fullwidth">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Form>
  )
}
