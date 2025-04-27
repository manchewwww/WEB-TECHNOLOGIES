"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
//import "../styles/RegisterPage.css";
function RegisterPage() {
    const [formData, setFormData] = (0, react_1.useState)({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const handleChange = (e) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [e.target.name]: e.target.value })));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };
    return (<div className="register-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required/>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required/>
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required/>
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required/>
        <button type="submit">Register</button>
      </form>
    </div>);
}
exports.default = RegisterPage;
