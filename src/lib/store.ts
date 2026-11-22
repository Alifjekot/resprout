import { AdminMetrics, Idea, Material, Pledge, PledgePage, Profile, Scan } from './types';
import { HERO_MATERIALS } from './seed';

// In-memory persistent database simulator for demo & full local operation
class ReSproutStore {
  private profiles: Profile[] = [
    {
      id: 'usr-demo-maker',
      email: 'maker@resprout.eco',
      displayName: 'Nur Fitri (Demo Maker)',
      role: 'maker',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-admin',
      email: 'admin@resprout.eco',
      displayName: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
  ];

  private materials: Material[] = [...HERO_MATERIALS];

  private scans: Scan[] = [];

  // Seed with one existing Tree-stage idea so demo showcases the Garden progression (Section 8 item 9)
  private ideas: Idea[] = [
    {
      id: 'idea-tree-demo',
      scanId: 'scan-seed-demo',
      userId: 'usr-demo-maker',
      name: 'Coffee-infused eco-fire logs for outdoor BBQs',
      description: 'Pressed spent coffee logs with vegetable wax that burn hotter and cleaner than traditional lumpwood charcoal.',
      technique: 'Combine',
      whyThisWorks: 'Spent grounds hold high caloric energy and emit pleasant roasted aromas for food vendors.',
      estStartupCostRm: 4200,
      demand: 5,
      difficulty: 2,
      sdgImpact: 5,
      co2SavedKgYear: 1250,
      score: 86,
      stage: 'tree',
      saved: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ];

  private pledgePages: PledgePage[] = [
    {
      id: 'page-tree-demo',
      ideaId: 'idea-tree-demo',
      slug: 'coffee-eco-firelogs',
      headline: 'Clean Barbecue Fuel Made From 100% Upcycled Cafe Coffee Grounds',
      body: 'Support our mission to replace deforested mangrove charcoal with high-energy bio-logs pressed from Johor cafe waste. Zero chemical accelerants, hotter flame, longer burn.',
      priceHintRm: 18,
      isPublished: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    },
  ];

  private pledges: Pledge[] = [
    { id: 'p1', pageId: 'page-tree-demo', name: 'Ahmad Daniel', email: 'ahmad@example.com', quantity: 2, consent: true, createdAt: new Date().toISOString() },
    { id: 'p2', pageId: 'page-tree-demo', name: 'Siti Sarah', email: 'sarah@example.com', quantity: 1, consent: true, createdAt: new Date().toISOString() },
    { id: 'p3', pageId: 'page-tree-demo', name: 'Wei Jian', email: 'weijian@example.com', quantity: 3, consent: true, createdAt: new Date().toISOString() },
    { id: 'p4', pageId: 'page-tree-demo', name: 'Dr. Zulkifli (UTHM)', email: 'zul@uthm.edu.my', quantity: 4, consent: true, createdAt: new Date().toISOString() },
    { id: 'p5', pageId: 'page-tree-demo', name: 'Kavitha Nair', email: 'kavi@example.com', quantity: 2, consent: true, createdAt: new Date().toISOString() },
    { id: 'p6', pageId: 'page-tree-demo', name: 'Batu Pahat Cafe Club', email: 'bpcafe@example.com', quantity: 5, consent: true, createdAt: new Date().toISOString() },
    { id: 'p7', pageId: 'page-tree-demo', name: 'Harith Iskandar', email: 'harith@example.com', quantity: 1, consent: true, createdAt: new Date().toISOString() },
    { id: 'p8', pageId: 'page-tree-demo', name: 'Farah Nadia', email: 'farah@example.com', quantity: 2, consent: true, createdAt: new Date().toISOString() },
    { id: 'p9', pageId: 'page-tree-demo', name: 'Green Steps Malaysia', email: 'hello@greensteps.my', quantity: 3, consent: true, createdAt: new Date().toISOString() },
    { id: 'p10', pageId: 'page-tree-demo', name: 'Tan Kah Kee', email: 'tankk@example.com', quantity: 2, consent: true, createdAt: new Date().toISOString() },
    { id: 'p11', pageId: 'page-tree-demo', name: 'Irfan Hakim', email: 'irfan@example.com', quantity: 1, consent: true, createdAt: new Date().toISOString() },
  ];

  // Scans
  getScans(userId: string) {
    return this.scans.filter((s) => s.userId === userId);
  }

  getScanById(id: string) {
    return this.scans.find((s) => s.id === id);
  }

  addScan(scan: Scan) {
    this.scans.unshift(scan);
    return scan;
  }

  updateScan(id: string, updates: Partial<Scan>) {
    const idx = this.scans.findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.scans[idx] = { ...this.scans[idx], ...updates };
      return this.scans[idx];
    }
    return null;
  }

  // Materials
  getMaterials() {
    return this.materials;
  }

  getMaterialById(id: string) {
    return this.materials.find((m) => m.id === id);
  }

  findMaterialByName(name: string) {
    const clean = name.toLowerCase().trim();
    return this.materials.find((m) => m.name.toLowerCase().includes(clean) || clean.includes(m.name.toLowerCase()));
  }

  // Ideas
  getIdeas(userId: string) {
    return this.ideas.filter((i) => i.userId === userId);
  }

  getSavedIdeas(userId: string) {
    return this.ideas.filter((i) => i.userId === userId && i.saved);
  }

  getIdeaById(id: string) {
    return this.ideas.find((i) => i.id === id);
  }

  addIdeas(newIdeas: Idea[]) {
    this.ideas.push(...newIdeas);
  }

  updateIdea(id: string, updates: Partial<Idea>) {
    const idx = this.ideas.findIndex((i) => i.id === id);
    if (idx !== -1) {
      this.ideas[idx] = { ...this.ideas[idx], ...updates };
      return this.ideas[idx];
    }
    return null;
  }

  // Pledge Pages
  getPledgePageByIdeaId(ideaId: string) {
    return this.pledgePages.find((p) => p.ideaId === ideaId);
  }

  getPledgePageById(id: string) {
    return this.pledgePages.find((p) => p.id === id);
  }

  getPledgePageBySlug(slug: string) {
    return this.pledgePages.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  }

  createPledgePage(page: PledgePage) {
    const existing = this.pledgePages.findIndex((p) => p.ideaId === page.ideaId);
    if (existing !== -1) {
      this.pledgePages[existing] = { ...this.pledgePages[existing], ...page };
      return this.pledgePages[existing];
    }
    this.pledgePages.push(page);
    return page;
  }

  updatePledgePage(id: string, updates: Partial<PledgePage>) {
    const idx = this.pledgePages.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.pledgePages[idx] = { ...this.pledgePages[idx], ...updates };
      return this.pledgePages[idx];
    }
    return null;
  }

  // Pledges
  getPledgesByPageId(pageId: string) {
    return this.pledges.filter((p) => p.pageId === pageId);
  }

  addPledge(pledge: Pledge) {
    // Check duplicate email
    const exists = this.pledges.some(
      (p) => p.pageId === pledge.pageId && p.email.toLowerCase() === pledge.email.toLowerCase()
    );
    if (exists) {
      throw new Error('This email address has already submitted a pledge for this idea.');
    }
    this.pledges.push(pledge);
    return pledge;
  }

  // Metrics
  getAdminMetrics(): AdminMetrics {
    const totalCo2SavedKg = this.ideas
      .filter((i) => i.saved)
      .reduce((acc, curr) => acc + (curr.co2SavedKgYear || 0), 0);

    return {
      totalUsers: this.profiles.length,
      totalScans: this.scans.length + 8, // demo offset
      totalIdeas: this.ideas.length,
      totalPledges: this.pledges.length,
      totalCo2SavedKg,
    };
  }
}

// Global singleton instance for serverless memory persistence
const globalForStore = global as unknown as { store: ReSproutStore };
export const store = globalForStore.store || new ReSproutStore();
if (process.env.NODE_ENV !== 'production') globalForStore.store = store;
