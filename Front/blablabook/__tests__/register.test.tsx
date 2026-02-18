import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "@/components/Auth/Register";

const replaceMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
    refresh: refreshMock,
  }),
}));

const registerActionMock = jest.fn();

jest.mock("@/lib/actions/auth.action", () => ({
  registerAction: (data: unknown) => registerActionMock(data),
}));

const signInMock = jest.fn();

jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => signInMock(...args),
}));

describe("Register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("shows validation errors when fields are empty", async () => {
    render(<Register />);

    await userEvent.click(
      screen.getByRole("button", { name: "Créer mon compte" }),
    );

    expect(
      await screen.findByText(
        "Le nom d'utilisateur doit contenir au moins 3 caractères",
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Veuillez entrer une adresse email valide"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        "Le mot de passe doit contenir au moins 12 caractères",
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        "Vous devez accepter les conditions d'utilisation",
      ),
    ).toBeInTheDocument();
  });

  it("shows an error toast when registerAction fails", async () => {
    registerActionMock.mockResolvedValue({
      success: false,
      error: "Email deja utilise",
    });

    render(<Register />);

    await userEvent.type(screen.getByLabelText("Nom d'utilisateur"), "user01");
    await userEvent.type(screen.getByLabelText("Email"), "test@example.com");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "GoodPass123!");
    await userEvent.type(
      screen.getByLabelText("Confirmer le mot de passe"),
      "GoodPass123!",
    );
    await userEvent.click(screen.getByLabelText(/conditions d'utilisation/i));

    await userEvent.click(
      screen.getByRole("button", { name: "Créer mon compte" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Email deja utilise",
    );
  });

  it("redirects on successful registration", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({
      advanceTimers: (ms) => jest.advanceTimersByTime(ms),
    });

    registerActionMock.mockResolvedValue({ success: true });
    signInMock.mockResolvedValue({ ok: true });

    render(<Register />);

    await user.type(screen.getByLabelText("Nom d'utilisateur"), "user01");
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Mot de passe"), "GoodPass123!");
    await user.type(
      screen.getByLabelText("Confirmer le mot de passe"),
      "GoodPass123!",
    );
    await user.click(screen.getByLabelText(/conditions d'utilisation/i));

    await user.click(screen.getByRole("button", { name: "Créer mon compte" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Compte créé avec succès !",
    );

    await act(async () => {
      await jest.runOnlyPendingTimersAsync();
    });

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "test@example.com",
        password: "GoodPass123!",
      });
      expect(replaceMock).toHaveBeenCalledWith("/mon-profil");
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
