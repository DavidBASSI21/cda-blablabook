import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LogoutBtn from "@/components/Auth/LogoutBtn";

const pushMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

const signOutMock = jest.fn();

jest.mock("next-auth/react", () => ({
  signOut: (...args: unknown[]) => signOutMock(...args),
}));

describe("LogoutBtn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("confirms and logs out", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({
      advanceTimers: (ms) => jest.advanceTimersByTime(ms),
    });

    signOutMock.mockResolvedValue({ ok: true });

    render(<LogoutBtn />);

    await user.click(screen.getByTitle("Se déconnecter"));

    expect(
      await screen.findByText("Confirmation de déconnexion"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Se déconnecter" }));

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalledWith({ redirect: false });
      expect(refreshMock).toHaveBeenCalled();
    });

    await act(async () => {
      await jest.runOnlyPendingTimersAsync();
    });

    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
