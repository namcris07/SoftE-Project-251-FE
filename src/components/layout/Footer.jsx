import React from 'react';
import { FaGithub, FaFacebook, FaEnvelope } from "react-icons/fa";
export function Footer() {
  return (
    <footer className="bg-[#0388B4] h-16 flex items-center px-8">
      {/* 🔹 Logo + Title */}
      <div className="flex items-center space-x-2">
        <a href="/" className="flex items-center">
          <img
            src="/logoBK.png"
            alt="Logo BK"
            className="w-10 h-10 object-contain bg-transparent"
          />
          <span className="text-white text-lg font-semibold leading-none"></span>
        </a>
        <div>
          <h2 className="text-white text-base font-medium">
            Tutor Support System
          </h2>
          <p className="text-white text-xs opacity-90">
            Built with 💙 by SofE-Newbie
          </p>
        </div>
      </div>

      {/* 🔹 Contact Icons */}
      <div className="ml-auto flex items-center space-x-4">
        <span className="text-white font-bold text-lg">Liên hệ</span>

        <a
          href="https://github.com/namcris07"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:opacity-80"
        >
          <FaGithub size={27.5} />
        </a>

        <a
          href="https://www.facebook.com/namcris07/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:opacity-80"
        >
          <FaFacebook size={27.5} />
        </a>

        <a
          href="https://mail.google.com/mail/u/0/?to=nam.nguyennamcris7@hcmut.edu.vn&fs=1&tf=cm"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:opacity-80"
        >
          <svg
            width="29"
            height="28"
            viewBox="0 0 29 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="14.5" cy="14" rx="14.5" ry="14" fill="white" />
            <path
              d="M7.67065 10.7193C7.67065 10.0946 8.17702 9.58826 8.80165 9.58826C9.42629 9.58826 9.93265 10.0946 9.93265 10.7193V19.1083H9.43362C8.45996 19.1083 7.67065 18.319 7.67065 17.3453V10.7193Z"
              fill="#0094FF"
            />
            <path
              d="M18.6327 10.7193C18.6327 10.0946 19.1391 9.58826 19.7637 9.58826C20.3883 9.58826 20.8947 10.0946 20.8947 10.7193V17.3453C20.8947 18.319 20.1054 19.1083 19.1317 19.1083H18.6327V10.7193Z"
              fill="#03A400"
            />
            <path
              d="M19.0887 9.56993C19.5528 9.17743 20.2595 9.22214 20.6702 9.66999C21.0866 10.124 21.0394 10.8177 20.5654 11.2116L17.9512 13.384L17.5239 10.8935L19.0887 9.56993Z"
              fill="#FFE600"
            />
            <path
              d="M7.78625 10.0142C8.13721 9.48653 8.84356 9.35294 9.3634 9.71533L14.6671 13.4126L17.548 10.8687L17.962 13.3726L14.7609 16.2397L8.09583 11.6274C7.57349 11.266 7.43451 10.5431 7.78625 10.0142Z"
              fill="#FF0909"
              fill-opacity="0.86"
            />
          </svg>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
