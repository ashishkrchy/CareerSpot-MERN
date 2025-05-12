import React from 'react';
import { Mail, Briefcase, Users, FileText, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

const Footer = () => {
  return (
    <footer className="bg-gray-900/70 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t-2 border-red-600 shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 max-w-7xl mx-auto">
        {/* Logo and description */}
        <div>
          <div className="flex items-center space-x-2 mb-4 sm:mb-6">
            <span className="text-2xl sm:text-3xl bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent font-bold">
              Career<span className="text-red-500">Spot</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
            Connecting top talent with world-class opportunities through our
            advanced job matching platform.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://twitter.com"
              className="border-2 border-blue-600 text-blue-400 hover:bg-blue-600/10 p-2 rounded-md cursor-pointer"
              aria-label="Twitter"
            >
              <svg
                className="h-4 sm:h-5 w-4 sm:w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/ashishkrchy/"
              className="border-2 border-blue-600 text-blue-400 hover:bg-blue-600/10 p-2 rounded-md cursor-pointer"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="h-4 sm:h-5 w-4 sm:w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 text-white">
            <Briefcase className="h-4 sm:h-5 w-4 sm:w-5 text-red-500" />
            <span>Quick Links</span>
          </h3>
          <ul className="space-y-2 sm:space-y-3">
            {[
              { name: 'Browse Jobs', href: '/jobs' },
              { name: 'Companies', href: '/companies' },
              { name: 'Career Resources', href: '/resources' },
              { name: 'Salary Calculator', href: '/salary-calculator' },
              { name: 'Interview Tips', href: '/interview-tips' },
            ].map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2 group text-sm sm:text-base"
                >
                  <ArrowRight className="h-3 w-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Job Categories */}
        <div>
          <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 text-white">
            <Users className="h-4 sm:h-5 w-4 sm:w-5 text-blue-500" />
            <span>Top Categories</span>
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {[
              'Tech',
              'Finance',
              'Healthcare',
              'Engineering',
              'Marketing',
              'Design',
              'Education',
              'Remote',
            ].map((category) => (
              <Button
                key={category}
                variant="outline"
                className="text-xs sm:text-sm px-2 sm:px-3 py-1 h-8 sm:h-9 border-gray-800 text-gray-300 hover:bg-blue-600/10 hover:border-blue-500 hover:text-blue-400"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 text-white">
            <Mail className="h-4 sm:h-5 w-4 sm:w-5 text-red-500" />
            <span>Newsletter</span>
          </h3>
          <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">
            Get weekly updates on new jobs and career advice
          </p>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full p-3 rounded-lg bg-gray-900 border-2 border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 h-12 text-sm sm:text-base"
              required
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white h-12 text-sm sm:text-base shadow-lg flex items-center gap-2"
            >
              Subscribe <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom copyright and links */}
      <div className="mt-12 sm:mt-16 border-t-2 border-gray-900 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-sm max-w-7xl mx-auto">
        <p className="text-gray-500 mb-4 md:mb-0">
          © {new Date().getFullYear()} JobJolt. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {[
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Cookie Policy', href: '/cookies' },
            { name: 'Contact Us', href: '/contact' },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
