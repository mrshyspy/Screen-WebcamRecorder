"use client";
import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r rounded-t-3xl from-green-500 to-blue-500 text-gray-950 pt-12 pb-6 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Recodek</h2>
          <p className="text-sm leading-relaxed">
            Record, edit, and share your screen with ease. Built for students,
            professionals, gamers, and creators — Recodek makes screen
            recording effortless.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#features" className="hover:text-gray-200">Features</a></li>
            <li><a href="#pricing" className="hover:text-gray-200">Pricing</a></li>
            <li><a href="#faq" className="hover:text-gray-200">FAQ</a></li>
            <li><a href="#contact" className="hover:text-gray-200">Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#docs" className="hover:text-gray-200">Documentation</a></li>
            <li><a href="#blog" className="hover:text-gray-200">Blog</a></li>
            <li><a href="#support" className="hover:text-gray-200">Support</a></li>
            <li><a href="#terms" className="hover:text-gray-200">Terms & Privacy</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-lg">
            <a href="#" className="hover:text-gray-200"><FaFacebookF /></a>
            <a href="#" className="hover:text-gray-200"><FaTwitter /></a>
            <a href="#" className="hover:text-gray-200"><FaLinkedinIn /></a>
            <a href="#" className="hover:text-gray-200"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-slate-700 pt-6 text-center text-sm text-gray-950">
        © {new Date().getFullYear()} Recodek. All rights reserved.
      </div>
    </footer>
  );
}
