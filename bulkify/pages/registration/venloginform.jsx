import React from 'react';
import Link from 'next/link';
import { Form, Input } from 'antd';

export default function venloginform() {
  return (
        <Form
            className="ps-form--account">
            <ul className="ps-tab-list">
                <li >
                    <Link href="/registration/vendors">
                        <a>Register As a Seller</a>
                            </Link>
                    </li>
                    <li className="active">
                        <Link href="#">
                            <a>Already A Seller</a>
                        </Link>
                    </li>
            </ul>
            <div className="ps-tab active" id="sign-in">
                <div className="ps-form__content">
                    <h5>Log In Your Account</h5>
                    <div className="form-group">
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Please input your email!',
                                },
                            ]}>
                            <Input
                                className="form-control"
                                type="text"
                                placeholder="Username or email address"
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
                    <div className="form-group">
                        <div className="ps-checkbox">
                            <input
                                className="form-control"
                                type="checkbox"
                                id="remember-me"
                                name="remember-me"
                            />
                            <label htmlFor="remember-me">
                                Rememeber me
                            </label>
                        </div>
                    </div>
                    <div className="form-group submit">
                        <button
                            type="submit"
                            className="ps-btn ps-btn--fullwidth">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </Form>
  )
}
