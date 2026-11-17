// Detailed case-study content shown when a "Selected work" card is clicked.
// Keyed by project `slug` (see portfolio-data.js).
// NOTE: metrics and project specifics below are illustrative - replace them
// with your real numbers, client types and screenshots before publishing.

export const caseStudies = {
  "zoho-creator": {
    role: "Lead Developer · Solution Architect",
    duration: "2023 – Present",
    client: "SMB & mid-market clients",
    summary:
      "Designing custom Zoho Creator applications that replace spreadsheets and disconnected tools with one system of record - covering order management, approvals, client portals and accounting sync with Zoho Books.",
    metrics: [
      { value: "12+", label: "Custom apps shipped" },
      { value: "70%", label: "Less manual data entry" },
      { value: "5", label: "Zoho apps integrated" },
      { value: "<2s", label: "Avg. report load" }
    ],
    challenge:
      "Clients ran operations across Excel sheets, email threads and separate accounting tools. Data was duplicated, approvals stalled in inboxes, and invoices were created by hand - leading to errors and delayed billing.",
    approach:
      "I modelled each business process as relational Creator forms, automated every hand-off with Deluge workflows, and connected Creator to Zoho Books and CRM via connections and REST APIs so a single record flows from order to invoice with no re-typing.",
    flow: [
      { title: "Capture", detail: "Order form with lookups, validation & subforms" },
      { title: "Approve", detail: "Multi-level approval by amount & department" },
      { title: "Sync", detail: "Deluge pushes customer & items to Zoho Books" },
      { title: "Invoice", detail: "Invoice auto-created, PDF emailed to client" },
      { title: "Report", detail: "Live pivot dashboards for management" }
    ],
    builds: [
      {
        title: "Order-to-Invoice Automation",
        description:
          "End-to-end pipeline where an approved order in Creator creates (or matches) the customer in Zoho Books, builds line items with tax rules and raises the invoice automatically.",
        points: [
          "Idempotent sync - re-runs never duplicate invoices",
          "Error log form with retry button for failed API calls",
          "Handles multi-currency and GST tax breakdown"
        ]
      },
      {
        title: "Role-based Client Portal",
        description:
          "A Creator portal where external clients log in to track orders, download invoices and raise requests - seeing only their own records.",
        points: [
          "Portal user profiles with record-level criteria",
          "Custom HTML pages with embedded reports",
          "Request form that routes to the right internal team"
        ]
      },
      {
        title: "Dynamic Approval Engine",
        description:
          "Configurable approval matrix stored as data, so admins change approvers and thresholds without touching code.",
        points: [
          "Rules evaluated by Deluge at submit time",
          "Escalation schedule if an approval waits > 24h",
          "Complete audit trail of every decision"
        ]
      }
    ],
    code: {
      language: "Deluge",
      title: "Create a Zoho Books invoice from an approved Creator order",
      snippet: `// Triggered on Order approval
orgId = "XXXXXXXX";
customer = zoho.books.getRecords("Contacts", orgId, {"email": input.Client_Email});
if (customer.get("contacts").size() == 0)
{
    newCustomer = {"contact_name": input.Client_Name, "email": input.Client_Email};
    customer_id = zoho.books.createRecord("Contacts", orgId, newCustomer)
                    .get("contact").get("contact_id");
}
else
{
    customer_id = customer.get("contacts").get(0).get("contact_id");
}

lineItems = List();
for each item in input.Order_Items
{
    lineItems.add({"item_id": item.Books_Item_ID, "quantity": item.Qty, "rate": item.Rate});
}

resp = zoho.books.createRecord("Invoices", orgId,
        {"customer_id": customer_id, "line_items": lineItems,
         "reference_number": input.Order_No});

if (resp.get("code") == 0)
{
    input.Invoice_ID = resp.get("invoice").get("invoice_id");
    input.Status = "Invoiced";
}
else
{
    insert into Sync_Errors [ Order = input.ID  Message = resp.get("message") ];
}`
    },
    gallery: [
      { src: "/images/zoho_creator_dashboard.png", caption: "Operations dashboard" },
      { src: "/images/zoho_creator_lab.png", caption: "Mobile app view" },
      { src: "/images/zoho_books_lab.png", caption: "Books invoice sync" }
    ],
    stack: ["Zoho Creator", "Deluge", "Zoho Books API", "Zoho CRM", "Creator Portals", "REST / Webhooks"],
    expertise: [
      "Relational data modelling with forms, lookups & subforms",
      "Deluge scripting: workflows, schedules, custom functions",
      "Connections & OAuth for cross-app and 3rd-party APIs",
      "Pages, reports, pivots and custom HTML widgets",
      "Portal setup with role & record-level permissions"
    ]
  },

  "node-express-apis": {
    role: "Backend Developer",
    duration: "2022 – Present",
    client: "Web & integration projects",
    summary:
      "Building secure, well-structured REST APIs with Node.js and Express backed by MySQL - powering web front-ends and acting as the integration layer between Zoho apps and external systems.",
    metrics: [
      { value: "40+", label: "REST endpoints built" },
      { value: "99.9%", label: "API uptime" },
      { value: "~120ms", label: "p95 response time" },
      { value: "0", label: "Duplicate webhook writes" }
    ],
    challenge:
      "Projects needed a reliable backend that could authenticate users, enforce permissions, accept high-volume webhooks from Zoho and payment gateways, and keep MySQL data consistent even when requests failed half-way.",
    approach:
      "A layered Express architecture - routes, validation, services and data access - with JWT auth, role-based middleware, transactional MySQL writes and idempotent webhook handling, plus structured logging for quick debugging.",
    flow: [
      { title: "Request", detail: "Client / Zoho webhook hits the API" },
      { title: "Guard", detail: "Rate limit, JWT verify, role check" },
      { title: "Validate", detail: "Schema validation of body & params" },
      { title: "Service", detail: "Business logic inside a DB transaction" },
      { title: "Respond", detail: "Consistent JSON + structured logs" }
    ],
    builds: [
      {
        title: "Auth & Role-based Access",
        description:
          "JWT access + refresh token flow with hashed passwords and reusable middleware that guards routes by role and resource ownership.",
        points: [
          "bcrypt hashing, token rotation & revocation",
          "authorize('admin', 'manager') middleware",
          "Rate limiting on login & sensitive routes"
        ]
      },
      {
        title: "Zoho Webhook Ingestion Service",
        description:
          "Endpoint that receives CRM/Books webhooks, verifies them, de-duplicates by event ID and writes to MySQL - safe against retries.",
        points: [
          "Signature / token verification",
          "Idempotency table with unique event keys",
          "Async processing so Zoho never times out"
        ]
      },
      {
        title: "Transactional Order Service",
        description:
          "Order creation that reserves stock, writes order + items and records payment atomically - rolling back everything on any failure.",
        points: [
          "MySQL transactions with connection pooling",
          "Row locking to prevent overselling",
          "Indexed queries & pagination for large tables"
        ]
      }
    ],
    code: {
      language: "JavaScript",
      title: "Transactional order endpoint with auth & validation",
      snippet: `router.post('/orders', authenticate, authorize('customer'), validate(orderSchema),
  async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      for (const item of req.body.items) {
        const [[product]] = await conn.query(
          'SELECT stock FROM products WHERE id = ? FOR UPDATE', [item.productId]);
        if (!product || product.stock < item.qty) {
          throw new ApiError(409, 'Insufficient stock');
        }
        await conn.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?', [item.qty, item.productId]);
      }

      const [order] = await conn.query(
        'INSERT INTO orders (user_id, total) VALUES (?, ?)', [req.user.id, req.body.total]);
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, qty) VALUES ?',
        [req.body.items.map(i => [order.insertId, i.productId, i.qty])]);

      await conn.commit();
      res.status(201).json({ id: order.insertId, status: 'created' });
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      conn.release();
    }
  });`
    },
    gallery: [
      { src: "/images/node_express_api.png", caption: "API architecture" },
      { src: "/images/node_express_lab.png", caption: "Service monitoring" },
      { src: "/images/mysql_lab.png", caption: "MySQL schema design" }
    ],
    stack: ["Node.js", "Express", "MySQL", "JWT", "REST", "Postman", "Git"],
    expertise: [
      "Layered API design: routes, services, data access",
      "Authentication, authorization & input validation",
      "MySQL schema design, indexing & transactions",
      "Webhook handling, retries and idempotency",
      "Centralised error handling & structured logging"
    ]
  },

  "zoho-crm-desk": {
    role: "Zoho CRM & Desk Consultant",
    duration: "2023",
    client: "Sales & support teams",
    summary:
      "Re-engineering sales and support operations on Zoho CRM and Zoho Desk - custom pipelines, guided Blueprints, automatic lead assignment and a two-way bridge between support tickets and customer records.",
    metrics: [
      { value: "3x", label: "Faster lead response" },
      { value: "100%", label: "Leads auto-assigned" },
      { value: "35%", label: "Fewer SLA breaches" },
      { value: "1", label: "Unified customer view" }
    ],
    challenge:
      "Leads were assigned manually and often went cold, deal stages were skipped, and support agents had no visibility into a customer's sales history - so the team worked in silos.",
    approach:
      "I rebuilt the CRM around the real sales process using Blueprints and validation rules, wrote Deluge functions for scoring and round-robin assignment, and connected Desk to CRM so tickets, SLAs and deal context live together.",
    flow: [
      { title: "Lead in", detail: "Web form / import / API" },
      { title: "Score", detail: "Deluge scores by source, size & intent" },
      { title: "Assign", detail: "Round-robin to available rep by region" },
      { title: "Blueprint", detail: "Guided stages with mandatory fields" },
      { title: "Support", detail: "Desk tickets linked to CRM account" }
    ],
    builds: [
      {
        title: "Lead Scoring & Round-robin Assignment",
        description:
          "Custom function that scores every new lead and assigns it to the next available rep in the right territory, skipping reps on leave.",
        points: [
          "Weighted scoring rules stored in a custom module",
          "Territory-aware round-robin pointer",
          "Instant notification + follow-up task creation"
        ]
      },
      {
        title: "Deal Blueprint & Approvals",
        description:
          "Blueprint that enforces the sales process - qualification checklist, discount approval above a threshold and contract upload before closing.",
        points: [
          "Transition-level mandatory fields & validations",
          "Manager approval for discounts > 15%",
          "Auto-creates onboarding tasks on Closed Won"
        ]
      },
      {
        title: "Desk ↔ CRM SLA Bridge",
        description:
          "Integration so Desk tickets show deal value and account tier, priority-based SLAs escalate automatically and CRM shows open tickets per account.",
        points: [
          "Tier-based SLA policies & escalation rules",
          "Ticket counts and CSAT synced back to CRM",
          "Account managers alerted on critical tickets"
        ]
      }
    ],
    code: {
      language: "Deluge",
      title: "Score and round-robin assign a new CRM lead",
      snippet: `void automation.assignLead(int leadId)
{
    lead = zoho.crm.getRecordById("Leads", leadId);

    // --- scoring ---
    score = 0;
    if (lead.get("Lead_Source") == "Website Demo") { score = score + 30; }
    if (lead.get("No_of_Employees") != null && lead.get("No_of_Employees") > 50) { score = score + 25; }
    if (lead.get("Email").endsWith("gmail.com") == false) { score = score + 15; }

    // --- territory round-robin ---
    region = ifnull(lead.get("Region"), "Default");
    reps = zoho.crm.searchRecords("Sales_Reps",
              "((Region:equals:" + region + ")and(Available:equals:true))");
    pointer = zoho.crm.searchRecords("RR_Pointers", "(Region:equals:" + region + ")").get(0);
    nextIndex = (pointer.get("Last_Index").toLong() + 1) % reps.size();
    owner = reps.get(nextIndex).get("User").get("id");

    zoho.crm.updateRecord("Leads", leadId,
        {"Owner": owner, "Lead_Score": score,
         "Rating": if(score >= 50, "Hot", "Warm")});
    zoho.crm.updateRecord("RR_Pointers", pointer.get("id"), {"Last_Index": nextIndex});

    zoho.crm.createRecord("Tasks", {"Subject": "Call new lead", "Owner": owner,
        "What_Id": leadId, "$se_module": "Leads", "Due_Date": zoho.currentdate});
}`
    },
    gallery: [
      { src: "/images/zoho_creator_dashboard.png", caption: "Sales analytics" },
      { src: "/images/zoho_crm_lab.png", caption: "Pipeline & Blueprint" },
      { src: "/images/zoho_books_lab.png", caption: "Deal-to-invoice handoff" }
    ],
    stack: ["Zoho CRM", "Zoho Desk", "Blueprint", "Deluge", "Workflow Rules", "Zoho Analytics"],
    expertise: [
      "Custom modules, layouts, fields & validation rules",
      "Blueprints, approval processes & assignment rules",
      "Deluge custom functions and scheduled automations",
      "Desk SLAs, escalations and CRM integration",
      "Reports and dashboards for sales leadership"
    ]
  },

  "web-app-engineering": {
    role: "Full-Stack Developer",
    duration: "2021 – Present",
    client: "Startups & internal tools",
    summary:
      "Owning web applications end-to-end - from responsive, accessible interfaces to the APIs and databases behind them - and shipping on tight deadlines without compromising quality.",
    metrics: [
      { value: "95+", label: "Lighthouse performance" },
      { value: "10+", label: "Apps delivered" },
      { value: "100%", label: "Responsive layouts" },
      { value: "On time", label: "Delivery record" }
    ],
    challenge:
      "Clients needed production-grade apps quickly: dashboards with lots of data, forms with complex validation, and interfaces that work equally well on phones and wide desktop screens.",
    approach:
      "A component-driven front-end with reusable UI pieces, a clean API contract with the Node backend, performance budgets (lazy loading, code-splitting, image optimisation) and tests on critical flows before each release.",
    flow: [
      { title: "Discover", detail: "Requirements, user flows & wireframes" },
      { title: "Design", detail: "Component system & responsive layouts" },
      { title: "Build", detail: "Front-end + API + database in parallel" },
      { title: "Test", detail: "Unit & flow tests, cross-device QA" },
      { title: "Ship", detail: "Deploy, monitor and iterate" }
    ],
    builds: [
      {
        title: "Data-heavy Admin Dashboard",
        description:
          "Dashboard with server-side pagination, filters, sorting and charts handling tens of thousands of records smoothly.",
        points: [
          "Debounced search & URL-synced filters",
          "Virtualised tables for large data sets",
          "Role-based menus and actions"
        ]
      },
      {
        title: "Reusable Component System",
        description:
          "Shared library of buttons, inputs, modals and tables with consistent design tokens, dark mode and accessible keyboard behaviour.",
        points: [
          "Tailwind design tokens & dark mode",
          "Focus management & ARIA for modals/menus",
          "Used across multiple client projects"
        ]
      },
      {
        title: "Resilient API Client Layer",
        description:
          "A single API client with auth headers, automatic retry with back-off, request cancellation and friendly error states.",
        points: [
          "Token refresh handled transparently",
          "Retry with exponential back-off",
          "Loading / empty / error UI states"
        ]
      }
    ],
    code: {
      language: "JavaScript",
      title: "API client with retry, back-off and token refresh",
      snippet: `export async function api(path, options = {}, attempt = 0) {
  const res = await fetch(BASE_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + auth.accessToken,
      ...options.headers,
    },
  });

  if (res.status === 401 && attempt === 0) {
    await auth.refresh();                 // rotate token once
    return api(path, options, attempt + 1);
  }

  if (res.status >= 500 && attempt < 3) {
    const delay = 2 ** attempt * 300;     // 300ms, 600ms, 1200ms
    await new Promise(r => setTimeout(r, delay));
    return api(path, options, attempt + 1);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message || 'Request failed');
  }
  return res.status === 204 ? null : res.json();
}`
    },
    gallery: [
      { src: "/images/web_app_engineering.png", caption: "Web application UI" },
      { src: "/images/node_express_api.png", caption: "Backend services" },
      { src: "/images/mysql_lab.png", caption: "Data layer" }
    ],
    stack: ["JavaScript", "Vue", "HTML / CSS", "Tailwind", "Node.js", "MySQL", "Git"],
    expertise: [
      "Responsive, accessible UI with modern CSS",
      "Component architecture and state management",
      "API design and integration with front-ends",
      "Performance optimisation & Lighthouse budgets",
      "Testing critical flows and cross-device QA"
    ]
  }
};
