import React from 'react'
import { RegisterScreen } from './RegisterScreen'

const loginButton = {
    backgroundColor: "#E84637",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bolder"
};
export const LoginScreen = () => {
    return (
        <>
            <form>
                <div className="container">
                    <div className="login-form">
                        <div className=" col-sm-6 col-md-6 col-lg-6">

                            <hr/>

                            <legend className="text-center">Log In</legend>

                            <div className="row mt-4">
                                <label for="exampleInputEmail1">Email</label>
                                <input type="email" className="form-control"  />
                            </div>

                            <div className="row mt-4">
                                <label for="exampleInputPassword1">Password</label>
                                <input type="password" className="form-control" />
                            </div>

                            <div className="button">
                                <div className="row mt-4">
                                <button className="btn btn-dark form-control" style={loginButton} > Log In</button>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <button onclick="location.href='client/src/components/RegisterScreen.js'" className="btn btn-dark form-control" style={loginButton}> Register </button>
                            </div>

                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}
export default LoginScreen;