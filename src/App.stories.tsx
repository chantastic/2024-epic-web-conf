import type { Meta, StoryObj } from "@storybook/react";

import { userEvent, within } from "@storybook/test";

import App from "./App";

const meta: Meta<typeof App> = {
  title: "TicTacToe",
  component: App,
};

export default meta;
type Story = StoryObj<typeof App>;

export const TicTacToe: Story = {};

export const FirstMoveIsX: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      await canvas.findByLabelText("Open space. Column 1. Row 1")
    );
  },
};
