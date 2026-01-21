import { Navbarr } from '../components/Navbarr';
import { Footer } from '../components/footer';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbarr />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg mb-6">
            Welcome to our Screen & Webcam Recorder application. We are passionate about providing
            high-quality, browser-based recording tools that make it easy for users to capture their
            screen and webcam simultaneously.
          </p>
          <p className="text-lg mb-6">
            Our mission is to create intuitive, powerful recording software that works directly in
            your browser without the need for external dependencies or installations.
          </p>
          <p className="text-lg mb-6">
            Built with modern web technologies including React, HTML5 Canvas API, and MediaRecorder,
            our application offers real-time video composition and seamless recording capabilities.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
              <ul className="space-y-2">
                <li>• Simultaneous screen and webcam recording</li>
                <li>• Picture-in-picture webcam overlay</li>
                <li>• Real-time preview and composition</li>
                <li>• Browser-native recording (no extensions needed)</li>
                <li>• Instant download of recordings</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Technologies</h2>
              <ul className="space-y-2">
                <li>• React for the user interface</li>
                <li>• Tailwind CSS for styling</li>
                <li>• HTML5 Canvas for video composition</li>
                <li>• MediaRecorder API for recording</li>
                <li>• MediaDevices API for capture</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;