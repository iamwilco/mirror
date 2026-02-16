import { render, screen } from "@testing-library/react";

import TransparencyMeter from "@/components/TransparencyMeter";

describe("TransparencyMeter", () => {
  it("renders the overall score", () => {
    render(<TransparencyMeter />);
    expect(screen.getByText(/overall score/i)).toBeInTheDocument();
  });
});
