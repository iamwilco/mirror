import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import TransparencyDetail from "@/components/TransparencyDetail";

jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: () => null,
  Cell: () => null,
  Tooltip: () => null,
}));

const mockItems = [
  {
    name: "Jack Briggs",
    status: "verified" as const,
    source: "Official site",
    notes: "No salary info",
    verifiedBy: "Community Review",
  },
  { name: "Committee Chair", status: "partial" as const, source: "Forum", notes: "" },
  { name: "Unknown Role", status: "missing" as const, source: "", notes: "Needs verification" },
];

const mockGaps = [
  "No public salary ranges",
  "Committee member list incomplete",
];

describe("TransparencyDetail", () => {
  it("renders category name and score", () => {
    render(
      <TransparencyDetail
        category="People & Compensation"
        score={50}
        items={mockItems}
        gaps={mockGaps}
      />
    );

    expect(screen.getByText("People & Compensation")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("renders evidence table with items", () => {
    render(
      <TransparencyDetail
        category="People & Compensation"
        score={50}
        items={mockItems}
        gaps={mockGaps}
      />
    );

    expect(screen.getByText("Jack Briggs")).toBeInTheDocument();
    expect(screen.getByText("Committee Chair")).toBeInTheDocument();
    expect(screen.getByText("Unknown Role")).toBeInTheDocument();
  });

  it("renders status badges", () => {
    render(
      <TransparencyDetail
        category="People & Compensation"
        score={50}
        items={mockItems}
        gaps={mockGaps}
      />
    );

    expect(screen.getByText("Verified")).toBeInTheDocument();
    expect(screen.getByText("Partial")).toBeInTheDocument();
    expect(screen.getByText("Missing")).toBeInTheDocument();
    expect(screen.getByText("Community Review")).toBeInTheDocument();
  });

  it("renders transparency gaps", () => {
    render(
      <TransparencyDetail
        category="People & Compensation"
        score={50}
        items={mockItems}
        gaps={mockGaps}
      />
    );

    expect(screen.getByText("No public salary ranges")).toBeInTheDocument();
    expect(screen.getByText("Committee member list incomplete")).toBeInTheDocument();
  });

  it("renders CTA link to contribute", () => {
    render(
      <TransparencyDetail
        category="People & Compensation"
        score={50}
        items={mockItems}
        gaps={mockGaps}
      />
    );

    const ctaLink = screen.getByRole("link", { name: /contribute data/i });
    expect(ctaLink).toHaveAttribute("href", "/#contribute");
  });

  it("renders back link to dashboard", () => {
    render(
      <TransparencyDetail
        category="People & Compensation"
        score={50}
        items={mockItems}
        gaps={mockGaps}
      />
    );

    const backLink = screen.getByRole("link", { name: /back to dashboard/i });
    expect(backLink).toHaveAttribute("href", "/#transparency");
  });

  it("does not render gaps section when gaps array is empty", () => {
    render(
      <TransparencyDetail
        category="People & Compensation"
        score={50}
        items={mockItems}
        gaps={[]}
      />
    );

    expect(screen.queryByText("Transparency Gaps")).not.toBeInTheDocument();
  });
});
