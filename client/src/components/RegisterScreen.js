import React from 'react'

const registerButton = {
    backgroundColor: "#E84637",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bolder"
};

export const RegisterScreen = () => {
    return (
        <div>
            <form>
                <div className="container">
                    <div className="login-form">
                        <div className=" col-sm-6 col-md-6 col-lg-6">

                            <hr/>

                            <legend className="text-center">Register</legend>

                            <div className="row mt-3">
                                <label >Email</label>
                                <input type="email" className="form-control"  aria-describedby="emailHelp" placeholder=""/>
                            </div>

                            <div className="row mt-3">
                                <label>Password</label>
                                <input type="password" className="form-control" i placeholder=""/>
                            </div>

                            <div className="row mt-3">
                                <label>Confirm password</label>
                                <input type="password" className="form-control" i placeholder=""/>
                            </div>

                            <div className="row mt-3">
                                <button className="btn btn-dark form-control" style={registerButton}> Register</button>
                            </div>

                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
