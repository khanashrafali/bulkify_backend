import React from 'react';
import Link from 'next/link';
import { Form, Input } from 'antd';


export default function form2() {
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
                                        name="otherplatforms"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'What other e-commerce platforms are you currently selling on?(If Niether then pass None)',
                                            },
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            placeholder="E-Commerce Platforms"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="otherbusiness"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Do you sell to business buyers?',
                                            },
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            placeholder="Yes/NO"
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group submit">
                                    <button
                                        type="submit"
                                        className="ps-btn ps-btn--fullwidth">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Form>
  )
}
