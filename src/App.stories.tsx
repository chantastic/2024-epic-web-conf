import type { Meta, StoryObj } from "@storybook/react";

import { userEvent, within, expect } from "@storybook/test";

import App from "./App";

const meta: Meta<typeof App> = {
  title: "TicTacToe",
  component: App,
};

export default meta;
type Story = StoryObj<typeof App>;

export const TicTacToe: Story = {};

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
  },
};
