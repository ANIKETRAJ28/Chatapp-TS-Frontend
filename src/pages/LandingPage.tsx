import { Shield, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 pt-20 pb-32">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Connect and Chat with Anyone, Anywhere
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience seamless communication with our modern chat platform. Connect with friends, family, and
              colleagues in real-time.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started Now
            </button>
          </div>
          <div className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=2070"
              alt="People chatting"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Why Choose ChatFlow?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-blue-600" />}
              title="Lightning Fast"
              description="Experience real-time messaging with zero lag"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-blue-600" />}
              title="Secure & Private"
              description="End-to-end encryption for all your conversations"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-blue-600" />}
              title="Group Chats"
              description="Create and manage multiple group conversations"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-blue-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
      <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
