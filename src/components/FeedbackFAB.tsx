
import { useState } from 'react';
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const FeedbackFAB = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [feedback, setFeedback] = useState('');
  const { isAuthenticated } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error('Please enter your feedback');
      return;
    }
    
    // Simulate sending feedback
    toast.success('Feedback sent! Thank you for helping us improve FoodVrse.');
    setSubject('');
    setFeedback('');
    setIsOpen(false);
  };

  const handleWhatsAppClick = () => {
    // Replace with actual WhatsApp community link
    window.open('https://wa.me/+254700000000', '_blank');
    toast.success('Opening WhatsApp community...');
  };

  return (
    <>
      {/* Floating Action Button with Gold Glow positioned above nav bar */}
      <Button
        id="feedback-fab"
        onClick={() => setIsOpen(true)}
        className={`fixed right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite] ${
          isAuthenticated ? 'bottom-24' : 'bottom-6'
        }`}
        style={{
          boxShadow: '0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.4), 0 0 60px rgba(251, 191, 36, 0.2)',
          filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))'
        }}
        size="sm"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-bold text-gray-900">
                Share Your Feedback
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Subject (optional)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Textarea
                    placeholder="Tell us about your idea, issue, or feedback..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full h-32 resize-none"
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Feedback
                </Button>

                <Button
                  type="button"
                  onClick={handleWhatsAppClick}
                  variant="outline"
                  className="w-full flex items-center gap-2 border-green-500 text-green-700 hover:bg-green-50"
                >
                  <MessageCircle className="w-4 h-4" />
                  Join WhatsApp Community
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FeedbackFAB;
