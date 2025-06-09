import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const FeatureSection = () => {
  // Animation states
  const [activeFeature, setActiveFeature] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Auto-rotate through features
  useEffect(() => {
    if (isHovering) return;
    
    const intervalId = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [isHovering]);

  // Check if element is in viewport
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('feature-section');
      if (!section) return;
      
      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      
      if (isVisible && !isInView) {
        setIsInView(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInView]);

  // Feature data
  const features = [
    {
      id: 'project-management',
      title: 'Project Management',
      description: 'Create projects with milestones and tasks. Track progress, manage deadlines, and collaborate with your team all in one place.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
        </svg>
      ),
      color: 'indigo',
      details: [
        'Visual Kanban boards',
        'Timeline views',
        'Task dependencies',
        'Custom workflows'
      ]
    },
    {
      id: 'client-management',
      title: 'Client Management',
      description: 'Store client information, track communications, and maintain relationships all in one organized system.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
      ),
      color: 'purple',
      details: [
        'Contact database',
        'Communication history',
        'Meeting scheduler',
        'Document sharing'
      ]
    },
    {
      id: 'invoicing',
      title: 'Invoicing & Payments',
      description: 'Create professional invoices, track payments, and manage your finances with ease.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
      ),
      color: 'pink',
      details: [
        'Custom invoice templates',
        'Automated reminders',
        'Multiple payment methods',
        'Financial reporting'
      ]
    },
    {
      id: 'time-tracking',
      title: 'Time Tracking',
      description: 'Track your work hours, monitor progress on tasks, and ensure you\'re billing clients accurately.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      color: 'blue',
      details: [
        'One-click time tracking',
        'Billable hours calculation',
        'Project time allocation',
        'Team time management'
      ]
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Get intelligent suggestions, business insights, and automated task management powered by AI.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
      ),
      color: 'amber',
      details: [
        'Smart task suggestions',
        'Business insight reports',
        'Email draft assistance',
        'Workflow automation'
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      description: 'Gain insights into your business performance with comprehensive reports and analytics.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
      color: 'green',
      details: [
        'Custom dashboards',
        'Performance metrics',
        'Export capabilities',
        'Trend analysis'
      ]
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <section id="feature-section" className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your freelance career or small business in one place
          </p>
        </motion.div>
        
        {/* Interactive Feature Showcase */}
        <div className="mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 via-purple-50/30 to-pink-50/30 rounded-3xl"></div>
          
          {/* 3D Feature Wheel */}
          <div className="relative rounded-3xl overflow-hidden border border-gray-100 shadow-xl bg-white">
            <div className="flex flex-col lg:flex-row">
              {/* Feature Navigation */}
              <div className="lg:w-1/3 bg-gradient-to-b from-gray-50 to-white p-6">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Explore Features</h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={feature.id}>
                      <button
                        onClick={() => {
                          setActiveFeature(index);
                          setIsHovering(true);
                        }}
                        onMouseEnter={() => {
                          setActiveFeature(index);
                          setIsHovering(true);
                        }}
                        onMouseLeave={() => setIsHovering(false)}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-all duration-300 ${
                          activeFeature === index 
                            ? `bg-${feature.color}-500 text-white shadow-lg` 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <span className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center mr-3 ${
                          activeFeature === index 
                            ? `bg-${feature.color}-400 text-white` 
                            : `bg-${feature.color}-100 text-${feature.color}-500`
                        }`}>
                          {feature.icon}
                        </span>
                        <span className="font-medium">{feature.title}</span>
                        {activeFeature === index && (
                          <ArrowRight className="ml-auto h-4 w-4" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Feature Detail */}
              <div className="lg:w-2/3 p-6 lg:p-10">
                <div className="relative h-full">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.id}
                      className="absolute inset-0 p-4"
                      initial={false}
                      animate={{ 
                        opacity: activeFeature === index ? 1 : 0,
                        x: activeFeature === index ? 0 : 50,
                        scale: activeFeature === index ? 1 : 0.9,
                      }}
                      transition={{ duration: 0.5 }}
                      style={{ display: activeFeature === index ? 'block' : 'none' }}
                    >
                      <div className="flex flex-col h-full">
                        <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-500 text-white flex items-center justify-center mb-6`}>
                          <div className="w-8 h-8">
                            {feature.icon}
                          </div>
                        </div>
                        
                        <h3 className={`text-2xl font-bold mb-3 text-${feature.color}-600`}>{feature.title}</h3>
                        <p className="text-gray-600 mb-6">
                          {feature.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
                          {feature.details.map((detail, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start"
                            >
                              <span className={`flex-shrink-0 p-1 rounded-full bg-${feature.color}-100 text-${feature.color}-500 mr-2`}>
                                <CheckCircle className="h-4 w-4" />
                              </span>
                              <span>{detail}</span>
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="mt-8">
                          <motion.button
                            className={`px-4 py-2 rounded-lg bg-${feature.color}-500 text-white font-medium flex items-center hover:bg-${feature.color}-600 transition-colors`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Learn More <ArrowRight className="ml-2 h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Abstract decoration */}
                      <div className={`absolute right-0 top-0 w-32 h-32 rounded-full bg-gradient-to-br from-${feature.color}-200/30 to-${feature.color}-100/10 -z-10 blur-xl`}></div>
                      <div className={`absolute right-20 bottom-20 w-24 h-24 rounded-full bg-gradient-to-tr from-${feature.color}-300/20 to-${feature.color}-100/5 -z-10 blur-lg`}></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300 }
              }}
              className={`border-none shadow-xl bg-gradient-to-br from-${feature.color}-50 to-${feature.color}-100 hover:shadow-2xl transition-all`}
            >
              <Card className="border-none h-full bg-transparent">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className={`w-12 h-12 bg-${feature.color}-500 rounded-lg flex items-center justify-center mb-6 text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-auto">
                    {feature.description}
                  </p>
                  <motion.div 
                    className="mt-6 flex justify-end"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <button className={`text-${feature.color}-600 font-medium flex items-center`}>
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
