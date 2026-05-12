import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api.js";
function PulseLogo() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <div className="absolute h-20 w-20 rotate-45 rounded-[1.75rem] bg-white/20" />
      <div className="absolute left-5 top-7 h-10 w-10 rounded-full bg-white/75" />
      <div className="absolute right-5 top-7 h-10 w-10 rounded-full bg-white/75" />
      <div className="absolute bottom-5 h-12 w-12 rotate-45 rounded-xl bg-white/90 shadow-xl shadow-purple-900/10" />
      <div className="absolute top-1 h-7 w-7 rounded-full bg-white shadow-lg" />
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const[formData, setFormData] = useState({
    name : "",
    email : "",
    password : "",
    confirmPassword : "",
    role : "DOCTOR",
  });
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name] : event.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if(formData.password !== formData.confirmPassword){
    alert("Passwords do not match");
    return;
  }

  try {

    const res = await API.post(
      "/auth/register",
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      }
    );

    alert(res.data.message);

    navigate("/login");

  } catch (error) {

    console.log(error);

    alert(error.response.data.message);

  }
};

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,#e9ddff_0,#f7f4ff_34%,#fdfbff_70%)] p-4 text-slate-900 sm:p-6 lg:p-8">
      <div className="absolute left-[-120px] top-[-100px] h-72 w-72 rounded-full bg-cyan-300/55 blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-80px] h-80 w-80 rounded-full bg-fuchsia-300/40 blur-3xl" />

      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-purple-200/60 lg:min-h-[680px] lg:grid-cols-[1fr_1.08fr]">
        <div className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-500 px-8 py-12 text-center text-white sm:px-12">
          <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-300/35" />
          <div className="absolute -right-12 top-20 h-28 w-28 rounded-full bg-white/15" />
          <div className="absolute bottom-[-90px] left-[-30px] h-56 w-72 rounded-[50%] bg-indigo-700/20" />
          <div className="absolute bottom-[-110px] right-[-60px] h-64 w-80 rounded-[50%] bg-white/10" />
          <div className="absolute left-20 top-20 h-3 w-3 rounded-full bg-white/25" />
          <div className="absolute right-28 top-14 h-4 w-4 rotate-45 rounded-sm bg-white/20" />

          <div className="relative z-10 flex flex-col items-center">
            <PulseLogo />
            <h1 className="mt-7 text-4xl font-bold tracking-wide sm:text-5xl">
              PulseCare
            </h1>
            <p className="mt-4 text-base font-semibold text-purple-50 sm:text-lg">
              Remote Healthcare Monitoring Platform
            </p>
            <p className="mt-5 max-w-sm text-sm leading-6 text-purple-50/90 sm:text-base">
              Join a connected care workspace for patient vitals,
              tele-consultation, and real-time health alerts.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white px-6 py-9 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <div className="mb-7">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-sm">
                <svg
                  aria-hidden="true"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 21s-7-4.5-7-10a7 7 0 1 1 14 0c0 5.5-7 10-7 10Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.9"
                  />
                  <path
                    d="M9 11h6M12 8v6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.9"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Create Account
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Set up your PulseCare access
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </span>
                <input
                  className="h-[50px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                  placeholder="Enter your full name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </span>
                <input
                  className="h-[50px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                  placeholder="Enter your email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </span>
                  <input
                    className="h-[50px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange} 
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Confirm Password
                  </span>
                  <input
                    className="h-[50px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                    placeholder="Confirm"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Role
                </span>
                <select
  className="h-[50px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition duration-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
  name="role"
  value={formData.role}
  onChange={handleChange}
>
  <option value="DOCTOR">DOCTOR</option>
  <option value="PATIENT">PATIENT</option>
</select>
              </label>

              <button
                className="w-full rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-purple-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-100"
                type="submit"
              >
                Create Account
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-medium text-slate-500">
              Already have an account?{" "}
              <Link
                className="font-bold text-purple-600 transition hover:text-purple-700"
                to="/login"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;
