import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search, HelpCircle, ArrowLeft, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import FAQModal from '@/components/FAQModal';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      category: 'Booking & Planning',
      questions: [
        {
          question: 'How far in advance should I book?',
          answer: 'We recommend booking 3-6 months in advance, especially for peak season (July-October) and luxury accommodations. However, we can often accommodate last-minute bookings depending on availability.'
        },
        {
          question: 'What\'s included in the safari packages?',
          answer: 'Most packages include accommodation, meals, game drives, professional guides, park fees, and airport transfers. International flights are typically not included unless specified. We\'ll provide a detailed itinerary with inclusions upon booking.'
        },
        {
          question: 'Do you offer custom safari itineraries?',
          answer: 'Absolutely! We specialize in creating personalized safari experiences tailored to your interests, budget, and travel dates. Our experts will work with you to design the perfect adventure.'
        },
        {
          question: 'Can I combine multiple destinations?',
          answer: 'Yes! Many of our guests combine destinations like Kenya and Tanzania for the ultimate safari experience. We can arrange seamless transfers between countries and create multi-country itineraries.'
        }
      ]
    },
    {
      category: 'Travel Requirements',
      questions: [
        {
          question: 'Do I need a visa for East Africa?',
          answer: 'Visa requirements vary by nationality. Most visitors need a visa for Kenya and/or Tanzania. We recommend checking with your local embassy or using services like VisaHQ. We can provide invitation letters to support your visa application.'
        },
        {
          question: 'What vaccinations do I need?',
          answer: 'Yellow fever vaccination is required if you\'re traveling from a country with risk of yellow fever transmission. Other recommended vaccinations include hepatitis A, typhoid, and routine vaccines. Consult your doctor or a travel clinic for personalized advice.'
        },
        {
          question: 'What should I pack for a safari?',
          answer: 'Pack neutral-colored clothing (khaki, beige, green), comfortable walking shoes, sun protection (hat, sunscreen, sunglasses), insect repellent, binoculars, camera, medications, and lightweight layers for varying temperatures.'
        }
      ]
    },
    {
      category: 'During Your Safari',
      questions: [
        {
          question: 'What is a typical day on safari like?',
          answer: 'Days typically start early (around 6 AM) with coffee/tea and a light breakfast before morning game drives. After lunch and rest, afternoon drives continue until sunset. Evenings include dinner and relaxation around the campfire.'
        },
        {
          question: 'Will I see the Big Five?',
          answer: 'While we can\'t guarantee wildlife sightings (as animals are wild), our experienced guides know the best areas and times to maximize your chances. Most guests see lions, elephants, buffalo, leopard, and rhino during their safari.'
        },
        {
          question: 'What if I have dietary restrictions?',
          answer: 'We accommodate various dietary requirements including vegetarian, vegan, gluten-free, and allergies. Please inform us at the time of booking so we can make appropriate arrangements with our lodges and camps.'
        }
      ]
    },
    {
      category: 'Payments & Cancellations',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept bank transfers, major credit cards (Visa, MasterCard, American Express), and PayPal. Payment schedules vary by package, but typically require a 20-30% deposit to confirm booking.'
        },
        {
          question: 'What is your cancellation policy?',
          answer: 'Cancellation policies vary by season and accommodation type. Generally, cancellations made 60+ days before travel receive a full refund minus a small administrative fee. Please check your specific booking terms for details.'
        },
        {
          question: 'Is travel insurance required?',
          answer: 'While not mandatory, we strongly recommend comprehensive travel insurance covering trip cancellation, medical emergencies, and evacuation. We can recommend trusted insurance providers.'
        }
      ]
    },
    {
      category: 'Accommodations',
      questions: [
        {
          question: 'What types of accommodation do you offer?',
          answer: 'We partner with luxury lodges, tented camps, and boutique hotels. Options range from intimate bush camps to 5-star luxury resorts, all carefully selected for their location, service, and safari experience.'
        },
        {
          question: 'Are the accommodations safe?',
          answer: 'All our partner accommodations prioritize guest safety with 24/7 security, emergency procedures, and trained staff. Many properties are fenced and have night guards. Your guide will also provide safety briefings.'
        },
        {
          question: 'Do accommodations have WiFi and electricity?',
          answer: 'Most luxury lodges and camps offer WiFi (though connectivity can be limited in remote areas) and 24-hour electricity. Some bush camps may use solar power and have limited connectivity, perfect for a digital detox!'
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-orange-600 hover:text-orange-700 mr-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <HelpCircle className="h-8 w-8 mr-3 text-orange-500" />
                  Frequently Asked Questions
                </h1>
                <p className="text-gray-600 mt-1">
                  Find answers to common questions about planning and experiencing your safari adventure
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/contact">
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
              </Link>
              <FAQModal
                trigger={
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Quick FAQ
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 text-lg py-3"
            />
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredFaqs.length > 0 ? (
          <div className="space-y-8">
            {filteredFaqs.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-orange-600 font-semibold">
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem
                        key={faqIndex}
                        value={`${categoryIndex}-${faqIndex}`}
                        className="border border-gray-200 rounded-lg px-4"
                      >
                        <AccordionTrigger className="text-left hover:text-orange-600 py-4">
                          <span className="font-medium">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-3">
              No results found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or browse all categories
            </p>
            <Button
              onClick={() => setSearchTerm('')}
              variant="outline"
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              Clear Search
            </Button>
          </div>
        )}

        {/* Still Need Help */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Still have questions?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Can't find what you're looking for? Our safari experts are here to help you plan the perfect African adventure.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button size="lg" className="bg-orange-600 hover:bg-orange-700 px-8">
                      <Mail className="h-5 w-5 mr-2" />
                      Contact Support
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50 px-8"
                    onClick={() => window.open('tel:+254116072343')}
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call: +254 116 072 343
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
