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
      await canvas.findByRole("button", { name: /Go to game start/i })
    );
  },
};

export const FirstMoveIsX: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    await userEvent.click(
      await canvas.findByLabelText("Open space. Column 1. Row 1")
    );

    await expect(
      (await canvas.findAllByLabelText("Taken space. X. Column 1. Row 1"))
        .length
    ).toBe(1);

    await expect(await canvas.findByText("Next player: O")).toBeInTheDocument();

    await expect(await canvas.findByRole("button", { name: /Go to move #1/i }));
  },
};

export const SecondMoveIsO: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    if (FirstMoveIsX.play) {
      await FirstMoveIsX.play(context);
    }

    await userEvent.click(
      await canvas.findByLabelText("Open space. Column 2. Row 1")
    );

    await expect(
      (await canvas.findAllByLabelText("Taken space. O. Column 2. Row 1"))
        .length
    ).toBe(1);

    await expect(await canvas.findByText("Next player: X")).toBeInTheDocument();

    await expect(await canvas.findByRole("button", { name: /Go to move #2/i }));
  },
};

export const XWins: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    if (SecondMoveIsO.play) {
      await SecondMoveIsO.play(context);
    }

    function moveOnSpaceWithLabel(label: string) {
      return userEvent.click(canvas.getByLabelText(label));
    }

    moveOnSpaceWithLabel("Open space. Column 1. Row 2");
    moveOnSpaceWithLabel("Open space. Column 2. Row 2");
    moveOnSpaceWithLabel("Open space. Column 1. Row 3");

    await expect(await canvas.findByText("Winner: X")).toBeInTheDocument();

    await expect(await canvas.findByRole("button", { name: /Go to move #5/i }));
  },
};

export const OWins: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    if (SecondMoveIsO.play) {
      await SecondMoveIsO.play(context);
    }

    function moveOnSpaceWithLabel(label: string) {
      return userEvent.click(canvas.getByLabelText(label));
    }

    moveOnSpaceWithLabel("Open space. Column 1. Row 2");
    moveOnSpaceWithLabel("Open space. Column 2. Row 2");
    moveOnSpaceWithLabel("Open space. Column 3. Row 3");
    moveOnSpaceWithLabel("Open space. Column 2. Row 3");

    await expect(await canvas.findByText("Winner: O")).toBeInTheDocument();

    await expect(await canvas.findByRole("button", { name: /Go to move #6/i }));
  },
};

export const OWinsThenGoesToMove4: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    if (OWins.play) {
      await OWins.play(context);
    }

    await userEvent.click(
      await canvas.findByRole("button", { name: /Go to move #4/i })
    );

    await expect((await canvas.findAllByLabelText(/Taken space/i)).length).toBe(
      4
    );
    await expect(await canvas.findByText("Next player: X")).toBeInTheDocument();
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
      await canvas.queryByRole("button", { name: /Go to move #6/i })
    ).toBeNull();

    await expect(
      await canvas.queryByRole("button", { name: /Go to move #5/i })
    ).not.toBeNull();

    await expect(await canvas.findByText("Winner: X")).toBeInTheDocument();
  },
};
