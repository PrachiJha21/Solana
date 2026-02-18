import { Link } from "wouter";
import {Layout} from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Lightbulb, BookOpen, HelpCircle, ShieldCheck, Zap, Users, MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import {SolanaStatus} from "@/components/SolanaStatus";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center space-y-20">

        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto pt-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 space-y-4 text-left"
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                Campus Governance 2.0
              </div>

              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground">
                Decentralized <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Student Life
                </span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Empower your campus voice. Submit proposals, share academic resources, and participate in student-led governance.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/suggestions">
                  <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/25">
                    Explore DAO
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/discussion">
                  <Button size="lg" variant="outline" className="rounded-full px-8">
                    Community Hub
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full md:w-80"
            >
              <SolanaStatus />
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <FeatureCard
            icon={Lightbulb}
            title="Suggestions"
            description="Propose changes and vote for campus improvements."
            href="/suggestions"
            color="text-amber-500"
            bg="bg-amber-500/10"
          />
          <FeatureCard
            icon={BookOpen}
            title="Academic Notes"
            description="Access peer-reviewed study materials and notes."
            href="/notes"
            color="text-blue-500"
            bg="bg-blue-500/10"
          />
          <FeatureCard
            icon={HelpCircle}
            title="Request Hub"
            description="Need materials? Ask the community for help."
            href="/requests"
            color="text-purple-500"
            bg="bg-purple-500/10"
          />
          <FeatureCard
            icon={MessageSquare}
            title="Discussions"
            description="Academic forum for peer-to-peer learning."
            href="/discussion"
            color="text-green-500"
            bg="bg-green-500/10"
          />
        </section>

        {/* Stats Section */}
        <section className="w-full bg-card rounded-3xl border border-border/50 p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="space-y-2 p-4">
              <div className="flex justify-center mb-4">
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold font-display">100%</h3>
              <p className="text-muted-foreground font-medium">On-Chain Transparency</p>
            </div>
            <div className="space-y-2 p-4">
              <div className="flex justify-center mb-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold font-display">DAO</h3>
              <p className="text-muted-foreground font-medium">Student Governed</p>
            </div>
            <div className="space-y-2 p-4">
              <div className="flex justify-center mb-4">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold font-display">&lt; 1s</h3>
              <p className="text-muted-foreground font-medium">Finality Time</p>
            </div>
          </div>
        </section>

        {/* Hero Image */}
        <div className="w-full relative rounded-3xl overflow-hidden aspect-[21/9] shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80"
            alt="University Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 text-white">
            <h2 className="text-3xl font-display font-bold mb-2">Built for the Future of Education</h2>
            <p className="text-white/80 max-w-xl">
              Join thousands of students leveraging blockchain technology to improve their academic experience.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function FeatureCard({
  icon: Icon, title, description, href, color, bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  color: string;
  bg: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -5 }}
        className="group relative p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer h-full"
      >
        <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-7 h-7 ${color}`} />
        </div>
        <h3 className="text-2xl font-display font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </motion.div>
    </Link>
  );
}