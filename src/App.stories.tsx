import type { Meta, StoryObj } from "@storybook/react";

import { userEvent, within, expect } from "@storybook/test";

import App from "./App";

const meta: Meta<typeof App> = {
  title: "TicTacToe",
  component: App,
};

export default meta;
type Story = StoryObj<typeof App>;

export const TicTacToe: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    await expect(
      canvas.getByRole("button", { name: /Go to game start/i }),
      "Go to game start button."
    ).toBeInTheDocument();
  },
};

export const FirstMoveIsX: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    await userEvent.click(canvas.getByLabelText("Open space. Column 1. Row 1"));

    await expect(
      canvas.getAllByLabelText("Taken space. X. Column 1. Row 1").length,
      "All taken spaces"
    ).toBe(1);

    await expect(canvas.getByText("Next player: O")).toBeInTheDocument();

    await expect(
      canvas.getByRole("button", { name: /Go to move #1/i })
    ).toBeInTheDocument();
  },
};

export const SecondMoveIsO: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    if (FirstMoveIsX.play) {
      await FirstMoveIsX.play(context);
    }

    await userEvent.click(canvas.getByLabelText("Open space. Column 2. Row 1"));

    await expect(
      canvas.getAllByLabelText("Taken space. O. Column 2. Row 1").length,
      "All taken spaces"
    ).toBe(1);

    await expect(canvas.getByText("Next player: X")).toBeInTheDocument();

    await expect(canvas.getByRole("button", { name: /Go to move #2/i }));
  },
};

export const XWins: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    if (SecondMoveIsO.play) {
      await SecondMoveIsO.play(context);
    }

    async function moveOnSpaceWithLabel(label: string) {
      return userEvent.click(canvas.getByLabelText(label));
    }

    await moveOnSpaceWithLabel("Open space. Column 1. Row 2");
    await moveOnSpaceWithLabel("Open space. Column 2. Row 2");
    await moveOnSpaceWithLabel("Open space. Column 1. Row 3");

    await expect(canvas.getByText("Winner: X")).toBeInTheDocument();

    await expect(
      canvas.getByRole("button", { name: /Go to move #5/i })
    ).toBeInTheDocument();
  },
};

export const OWins: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    if (SecondMoveIsO.play) {
      await SecondMoveIsO.play(context);
    }

    async function moveOnSpaceWithLabel(label: string) {
      return userEvent.click(canvas.getByLabelText(label));
    }

    await moveOnSpaceWithLabel("Open space. Column 1. Row 2");
    await moveOnSpaceWithLabel("Open space. Column 2. Row 2");
    await moveOnSpaceWithLabel("Open space. Column 3. Row 3");
    await moveOnSpaceWithLabel("Open space. Column 2. Row 3");

    await expect(canvas.getByText("Winner: O")).toBeInTheDocument();

    await expect(
      canvas.getByRole("button", { name: /Go to move #6/i })
    ).toBeInTheDocument();
  },
};

export const OWinsThenGoesToMove4: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    if (OWins.play) {
      await OWins.play(context);
    }

    await userEvent.click(
      canvas.getByRole("button", { name: /Go to move #4/i })
    );

    await expect(
      canvas.getAllByLabelText(/Taken space/i).length,
      "All take spaces"
    ).toBe(4);

    await expect(canvas.getByText("Next player: X")).toBeInTheDocument();
  },
};

export const OWinsThenGoesToMove4PlayWinningXMove: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    if (OWinsThenGoesToMove4.play) {
      await OWinsThenGoesToMove4.play(context);
    }

    await userEvent.click(canvas.getByLabelText("Open space. Column 1. Row 3"));

    await expect(
      canvas.queryByRole("button", { name: /Go to move #6/i })
    ).toBeNull();

    await expect(
      canvas.queryByRole("button", { name: /Go to move #5/i })
    ).toBeInTheDocument();

    await expect(await canvas.findByText("Winner: X")).toBeInTheDocument();
  },
};
