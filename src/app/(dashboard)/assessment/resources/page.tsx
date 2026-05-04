"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Code,
  Video,
  Globe,
  FileText,
  ExternalLink,
  Search,
  Star,
  ChevronDown,
  ChevronUp,
  Target,
  Lightbulb,
  GraduationCap,
  Bookmark,
  Trash2,
  Clock
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "documentation" | "tutorial" | "video" | "article" | "practice";
  topic: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  isBookmarked?: boolean;
}

const INITIAL_RESOURCES: Resource[] = [
  {
    id: "r1",
    title: "Java TreeMap Documentation",
    description: "Official Oracle documentation for Java TreeMap class, covering all methods and usage patterns.",
    url: "https://docs.oracle.com/javase/8/docs/api/java/util/TreeMap.html",
    type: "documentation",
    topic: "Binary Search Trees",
    difficulty: "Intermediate",
    estimatedTime: "30 min"
  },
  {
    id: "r2",
    title: "GeeksforGeeks BST Tutorial",
    description: "Comprehensive tutorial on Binary Search Trees with code examples and visualizations.",
    url: "https://www.geeksforgeeks.org/binary-search-tree-data-structure/",
    type: "tutorial",
    topic: "Binary Search Trees",
    difficulty: "Beginner",
    estimatedTime: "45 min"
  },
  {
    id: "r3",
    title: "BST Operations Visualizer",
    description: "Interactive visualization tool to understand BST insertion, deletion, and traversal operations.",
    url: "https://visualgo.net/en/bst",
    type: "practice",
    topic: "Binary Search Trees",
    difficulty: "Beginner",
    estimatedTime: "20 min"
  },
  {
    id: "r4",
    title: "Understanding Java Collections Framework",
    description: "Deep dive into Java Collections, including List, Set, Map interfaces and their implementations.",
    url: "https://docs.oracle.com/javase/tutorial/collections/",
    type: "documentation",
    topic: "Java Collections Framework",
    difficulty: "Intermediate",
    estimatedTime: "60 min"
  },
  {
    id: "r5",
    title: "Java Exception Handling Best Practices",
    description: "Learn proper exception handling patterns, try-catch blocks, and custom exceptions.",
    url: "https://www.baeldung.com/java-exceptions",
    type: "article",
    topic: "Exception Handling",
    difficulty: "Intermediate",
    estimatedTime: "25 min"
  },
  {
    id: "r6",
    title: "OOP Concepts in Java - Full Course",
    description: "Video tutorial covering encapsulation, inheritance, polymorphism, and abstraction in Java.",
    url: "https://www.youtube.com/watch?v=JeznWDKZdE",
    type: "video",
    topic: "OOP Design",
    difficulty: "Beginner",
    estimatedTime: "90 min"
  },
  {
    id: "r7",
    title: "Java Syntax and Basic I/O Practice",
    description: "Interactive coding exercises for mastering Java syntax, input/output operations.",
    url: "https://codingbat.com/java",
    type: "practice",
    topic: "Java Syntax and Basic I/O",
    difficulty: "Beginner",
    estimatedTime: "40 min"
  },
  {
    id: "r8",
    title: "Advanced BST: AVL and Red-Black Trees",
    description: "Understanding self-balancing BST implementations and their rotation operations.",
    url: "https://www.cs.usfca.edu/~galles/visualization/RedBlack.html",
    type: "tutorial",
    topic: "Binary Search Trees",
    difficulty: "Advanced",
    estimatedTime: "60 min"
  }
];

const TOPIC_COLORS: Record<string, string> = {
  "Binary Search Trees": "border-blue-500/30 text-blue-400 bg-blue-500/10",
  "Java Collections Framework": "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  "Exception Handling": "border-amber-500/30 text-amber-400 bg-amber-500/10",
  "OOP Design": "border-purple-500/30 text-purple-400 bg-purple-500/10",
  "Java Syntax and Basic I/O": "border-teal-500/30 text-teal-400 bg-teal-500/10",
};

const TYPE_ICONS: Record<string, typeof BookOpen> = {
  documentation: BookOpen,
  tutorial: Lightbulb,
  video: Video,
  article: FileText,
  practice: Code,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  "Beginner": "border-green-500/30 text-green-400 bg-green-500/10",
  "Intermediate": "border-amber-500/30 text-amber-400 bg-amber-500/10",
  "Advanced": "border-red-500/30 text-red-400 bg-red-500/10",
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("assessment_resources");
    if (stored) {
      setResources(JSON.parse(stored));
    } else {
      setResources(INITIAL_RESOURCES);
      localStorage.setItem("assessment_resources", JSON.stringify(INITIAL_RESOURCES));
    }
  }, []);

  const toggleBookmark = (id: string) => {
    const updated = resources.map(r => r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r);
    setResources(updated);
    localStorage.setItem("assessment_resources", JSON.stringify(updated));
  };

  const toggleTopic = (topic: string) => {
    setExpandedTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
  };

  const clearAllBookmarks = () => {
    const updated = resources.map(r => ({ ...r, isBookmarked: false }));
    setResources(updated);
    localStorage.setItem("assessment_resources", JSON.stringify(updated));
  };

  const topics = Array.from(new Set(resources.map(r => r.topic)));

  const filteredResources = resources.filter(r => {
    if (selectedTopic !== "all" && r.topic !== selectedTopic) return false;
    if (selectedType !== "all" && r.type !== selectedType) return false;
    if (bookmarkedOnly && !r.isBookmarked) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(query) || r.description.toLowerCase().includes(query);
    }
    return true;
  });

  const groupedByTopic = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.topic]) acc[resource.topic] = [];
    acc[resource.topic].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  const bookmarkedCount = resources.filter(r => r.isBookmarked).length;

  return (
    <div className="space-y-6 animate-slide-up">

      {/* Header */}
      <div className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-[-50%] bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-teal-500/0 animate-pulse" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-white mb-2">Suggested Resources</h1>
              <p className="text-white/60">Curated learning materials for each assessment topic</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-[#0F172A] rounded-xl border border-white/10">
                <p className="text-xs text-white/50 uppercase tracking-wider">Total</p>
                <p className="text-xl font-black text-white">{resources.length}</p>
              </div>
              <div className="px-4 py-2 bg-amber-500/10 rounded-xl border border-amber-500/30">
                <p className="text-xs text-amber-400 uppercase tracking-wider">Bookmarked</p>
                <p className="text-xl font-black text-amber-400">{bookmarkedCount}</p>
              </div>
              {bookmarkedCount > 0 && (
                <button
                  onClick={clearAllBookmarks}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search resources by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-white/10 rounded-xl text-white text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/20 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-4 py-2 bg-[#0F172A] border border-white/10 rounded-xl text-white text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="all">All Topics</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-[#0F172A] border border-white/10 rounded-xl text-white text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="documentation">Documentation</option>
              <option value="tutorial">Tutorial</option>
              <option value="video">Video</option>
              <option value="article">Article</option>
              <option value="practice">Practice</option>
            </select>

            <button
              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                bookmarkedOnly
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "bg-[#0F172A]/50 text-white/50 border-white/5 hover:text-white/80 hover:border-white/10"
              }`}
            >
              <Bookmark className="w-4 h-4 inline mr-1.5" />
              Bookmarked Only
            </button>
          </div>
        </div>
      </div>

      {/* Resources by Topic */}
      {Object.keys(groupedByTopic).length === 0 ? (
        <div className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-12 text-center">
          <Bookmark className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Resources Found</h3>
          <p className="text-white/50">
            {searchQuery ? "Try a different search term" : "No resources match your filters"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByTopic).map(([topic, topicResources]) => {
            const isExpanded = expandedTopics[topic];
            const topicColor = TOPIC_COLORS[topic] || "border-white/30 text-white/70 bg-white/5";

            return (
              <div key={topic} className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
                {/* Topic Header */}
                <div
                  className="p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => toggleTopic(topic)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl border ${topicColor}`}>
                        <Target className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{topic}</h3>
                        <p className="text-xs text-white/40">
                          {topicResources.length} resource{topicResources.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="hidden md:flex items-center gap-2">
                        {topicResources.filter(r => r.isBookmarked).length > 0 && (
                          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                            <Bookmark className="w-3 h-3 mr-1" />
                            {topicResources.filter(r => r.isBookmarked).length} Saved
                          </Badge>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-white/40" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/40" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Topic Resources */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-white/5 space-y-3">
                    {topicResources.map((resource) => {
                      const TypeIcon = TYPE_ICONS[resource.type] || BookOpen;
                      const difficultyColor = DIFFICULTY_COLORS[resource.difficulty] || "";

                      return (
                        <div
                          key={resource.id}
                          className="bg-[#0F172A] rounded-xl border border-white/5 p-4 hover:border-white/10 transition-all group"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg shrink-0 ${
                              resource.type === 'documentation' ? 'bg-blue-500/10' :
                              resource.type === 'tutorial' ? 'bg-purple-500/10' :
                              resource.type === 'video' ? 'bg-red-500/10' :
                              resource.type === 'article' ? 'bg-emerald-500/10' :
                              'bg-amber-500/10'
                            }`}>
                              <TypeIcon className={`w-4 h-4 ${
                                resource.type === 'documentation' ? 'text-blue-400' :
                                resource.type === 'tutorial' ? 'text-purple-400' :
                                resource.type === 'video' ? 'text-red-400' :
                                resource.type === 'article' ? 'text-emerald-400' :
                                'text-amber-400'
                              }`} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="text-white font-semibold group-hover:text-teal-300 transition-colors">
                                  {resource.title}
                                </h4>
                                <button
                                  onClick={() => toggleBookmark(resource.id)}
                                  className={`p-1 rounded-lg shrink-0 transition-all ${
                                    resource.isBookmarked
                                      ? 'bg-amber-500/20 text-amber-400'
                                      : 'hover:bg-white/5 text-white/20 hover:text-amber-400/50'
                                  }`}
                                  title={resource.isBookmarked ? "Remove bookmark" : "Bookmark this resource"}
                                >
                                  <Bookmark className={`w-4 h-4 ${resource.isBookmarked ? 'fill-amber-400' : ''}`} />
                                </button>
                              </div>

                              <p className="text-sm text-white/60 mb-3 leading-relaxed">
                                {resource.description}
                              </p>

                              <div className="flex items-center gap-3 flex-wrap">
                                <Badge variant="outline" className={difficultyColor}>
                                  {resource.difficulty}
                                </Badge>
                                <Badge variant="outline" className="border-white/10 text-white/40">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {resource.estimatedTime}
                                </Badge>
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-lg text-xs font-semibold hover:bg-teal-500/20 transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Open Resource
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer */}
      <div className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Learning Resources Summary</h3>
            <p className="text-sm text-white/50">
              {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} available
              {selectedTopic !== "all" && ` for ${selectedTopic}`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {(["documentation", "tutorial", "video", "practice", "article"] as const).map(type => {
              const count = filteredResources.filter(r => r.type === type).length;
              if (count === 0) return null;
              const TypeIcon = TYPE_ICONS[type];
              return (
                <div key={type} className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TypeIcon className="w-4 h-4 text-white/40" />
                  </div>
                  <p className="text-xs text-white/40">{count} {type}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
