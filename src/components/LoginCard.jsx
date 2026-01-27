    import React, { useState } from 'react';

    const LoginCard = () => {
      const [view, setView] = useState('signin');

      const activeBarTop = view === 'signin' ? '33.33%' : '66.66%';
      const heroInnerTop = view === 'signin' ? '0' : '-100%';
      const formsTop = view === 'signin' ? '0' : '-100%';

      return (
        <div className="m-0 bg-[#212531] text-[#747b92] min-h-screen grid place-items-center overflow-hidden font-['Poppins',_sans-serif] p-4">
          <div className="flex flex-col md:flex-row items-stretch w-full max-w-[660px] h-auto md:h-[360px] rounded-lg bg-black/32 shadow-2xl">

          {/* NAV */}

<ul className="relative flex flex-row md:flex-col justify-between md:justify-center w-full md:w-[148px] h-12 md:h-auto">
  <div
    className={`absolute rounded bg-[#4672ff] transition-all duration-500
      top-0 h-0.5 w-16 md:left-0 md:w-1.5 md:h-1/3
      ${view === 'signin' ? 'left-[42%] md:top-[33.33%]' : 'left-[75%] md:top-[66.66%]'}
    `}
  />
      <li className="flex-1 grid place-items-center">
        <img src="logo.svg" alt="Logo" />
      </li>
      <li className="flex-1 grid place-items-center">
        <button
          onClick={() => setView('signin')}
          className={`opacity-75 hover:opacity-100 ${
            view === 'signin' ? 'text-white opacity-100' : ''
          }`}
        >
          Sign In
        </button>
      </li>
      <li className="flex-1 grid place-items-center">
        <button
          onClick={() => setView('signup')}
          className={`opacity-75 hover:opacity-100 ${
            view === 'signup' ? 'text-white opacity-100' : ''
          }`}
        >
          Sign Up
        </button>
      </li>
    </ul>


            {/* HERO (UNCHANGED) */}
    <div className="relative flex flex-col justify-end flex-none w-full md:w-[300px] h md:h-auto -mt-4 md:-my-12 overflow-hidden rounded-xl bg-[#4672ff]">
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{ top: heroInnerTop }}
      >




    <div className="h-[200px] md:h-[456px] w-full flex flex-col justify-start md:justify-center">
    <h2 className="pl-6 pt-4 md:pt-0 text-white text-lg md:text-2xl">Welcome Back.</h2>
    <h3 className="pl-6 pt-1 md:pt-0 text-white/75 text-xs md:text-sm">
        Please enter your credentials.
      </h3>
    <img src="signin.svg" alt="Sign In" className="w-full h-24 md:h-auto object-contain self-start" />
    </div>

                <div className="h-[456px] w-full flex flex-col justify-center">
                  <h2 className="pl-6 text-white text-lg md:text-2xl">Sign Up Now.</h2>
                  <h3 className="pl-6 text-white/75 text-xs md:text-sm">
                    Join the crowd and get started.
                  </h3>
    <img src="signup.svg" alt="Sign Up" className="w-full h-24 md:h-auto object-contain self-start" />
                </div>
              </div>
            </div>




            

            {/* FORM */}
            <div className="relative overflow-hidden p-4 md:p-6 w-full md:w-[400px]">

              {/* DESKTOP (ORIGINAL ANIMATION) */}
              <div
                className="hidden md:block absolute h-[200%] left-0 transition-all duration-500"
                style={{ top: formsTop }}
              >
                {/* SIGN IN */}
                <form className="h-[360px] p-6 flex flex-col justify-center gap-2">
                  <label>Email</label>
                  <input className="h-10 px-3 rounded bg-transparent border border-white/20" />
                  <label>Password</label>
                  <input type="password" className="h-10 px-3 rounded bg-transparent border border-white/20" />
                  <button className="h-10 bg-[#426df8] text-white rounded mt-3">SIGN IN</button>
                </form>

                {/* SIGN UP */}
                <form className="h-[360px] p-6 flex flex-col justify-center gap-2">
                  <label>Username</label>
                  <input className="h-10 px-3 rounded bg-transparent border border-white/20" />
                  <label>Email</label>
                  <input className="h-10 px-3 rounded bg-transparent border border-white/20" />
                  <label>Password</label>
                  <input type="password" className="h-10 px-3 rounded bg-transparent border border-white/20" />
                  <button className="h-10 bg-[#426df8] text-white rounded mt-3">SIGN UP</button>
                </form>
              </div>

              {/* MOBILE (ONLY ACTIVE FORM) */}
              <div className="block md:hidden">
                {view === 'signin' && (
                  <form className="p-6 flex flex-col gap-2">
                    <label>Email</label>
                    <input className="h-10 px-3 rounded bg-transparent border border-white/20" />
                    <label>Password</label>
                    <input type="password" className="h-10 px-3 rounded bg-transparent border border-white/20" />
                    <button className="h-10 bg-[#426df8] text-white rounded mt-3">SIGN IN</button>
                  </form>
                )}

                {view === 'signup' && (
                  <form className="p-6 flex flex-col gap-2">
                    <label>Username</label>
                    <input className="h-10 px-3 rounded bg-transparent border border-white/20" />
                    <label>Email</label>
                    <input className="h-10 px-3 rounded bg-transparent border border-white/20" />
                    <label>Password</label>
                    <input type="password" className="h-10 px-3 rounded bg-transparent border border-white/20" />
                    <button className="h-10 bg-[#426df8] text-white rounded mt-3">SIGN UP</button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      );
    };

    export default LoginCard;
