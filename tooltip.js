import addGlobalEventListener from "./utils/addGlobalEventListener.js";

///////////////////////////////////////////////////
const tooltipContainer = document.createElement("div");
tooltipContainer.classList.add("tooltip-container");
document.body.append(tooltipContainer);
const DEFAULT_SPACING = 5;

///////////////////////////////////////////////////
// Helper functions

// Create tooltip
const createTooltip = function (text) {
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  tooltip.innerText = text;
  return tooltip;
};

// Reset Tooltip position
const resetTooltipPosition = function (tooltip) {
  // Remove the initial centering of tooltip
  tooltip.style.top = "initial";
  tooltip.style.left = "initial";
  tooltip.style.right = "initial";
  tooltip.style.bottom = "initial";
};

// Check if the tooltip is out of bound
const isOutOfBounds = function (tooltip, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect();
  const tooltipContainerRect = tooltipContainer.getBoundingClientRect();

  return {
    top: tooltipRect.top <= tooltipContainerRect.top + spacing,
    left: tooltipRect.left <= tooltipContainerRect.left + spacing,
    right: tooltipRect.right >= tooltipContainerRect.right - spacing,
    bottom: tooltipRect.bottom >= tooltipContainerRect.bottom - spacing,
  };
};

// Position tooltip top
const positionTooltipTop = function (tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect();

  tooltip.style.top = `${elementRect.top - tooltipRect.height - spacing}px`;

  tooltip.style.left = `${
    elementRect.left + elementRect.width / 2 - tooltipRect.width / 2
  }px`;

  const bounds = isOutOfBounds(tooltip, spacing);

  if (bounds.top) {
    resetTooltipPosition(tooltip);
    return false;
  }

  if (bounds.right) {
    tooltip.style.right = `${spacing}px`;
    tooltip.style.left = "initial";
  }
  if (bounds.left) {
    tooltip.style.left = `${spacing}px`;
  }

  return true;
};
// Position tooltip bottom
const positionTooltipBottom = function (tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect();

  tooltip.style.top = `${elementRect.bottom + spacing}px`;

  tooltip.style.left = `${
    elementRect.left + elementRect.width / 2 - tooltipRect.width / 2
  }px`;

  const bounds = isOutOfBounds(tooltip, spacing);

  if (bounds.top) {
    resetTooltipPosition(tooltip);
    return false;
  }

  if (bounds.right) {
    tooltip.style.right = `${spacing}px`;
    tooltip.style.left = "initial";
  }
  if (bounds.left) {
    tooltip.style.left = `${spacing}px`;
  }

  return true;
};

// Position tooltip left
const positionTooltipLeft = function (tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect();

  tooltip.style.top = `${
    elementRect.top + elementRect.height / 2 - tooltipRect.height / 2
  }px`;

  tooltip.style.left = `${elementRect.left - tooltipRect.width - spacing}px`;

  const bounds = isOutOfBounds(tooltip, spacing);

  if (bounds.left) {
    resetTooltipPosition(tooltip);
    return false;
  }

  if (bounds.bottom) {
    tooltip.style.bottom = `${spacing}px`;
    tooltip.style.top = "initial";
  }
  if (bounds.top) {
    tooltip.style.top = `${spacing}px`;
  }

  return true;
};

// Position tooltip right
const positionTooltipRight = function (tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect();

  tooltip.style.top = `${
    elementRect.top + elementRect.height / 2 - tooltipRect.height / 2
  }px`;

  tooltip.style.left = `${elementRect.right + spacing}px`;

  const bounds = isOutOfBounds(tooltip, spacing);

  if (bounds.right) {
    resetTooltipPosition(tooltip);
    return false;
  }

  if (bounds.bottom) {
    tooltip.style.bottom = `${spacing}px`;
    tooltip.style.top = "initial";
  }
  if (bounds.top) {
    tooltip.style.top = `${spacing}px`;
  }

  return true;
};

// Position tooltip
/**
 *
 * @param {*} tooltip element
 * @param {*} element Element the tooltip to be positioned over
 */

const POSITION_ORDER = ["top", "bottom", "left", "right"];
const POSITION_TO_FUNCTION_MAP = {
  top: positionTooltipTop,
  bottom: positionTooltipBottom,
  left: positionTooltipLeft,
  right: positionTooltipRight,
};

const positionTooltip = function (tooltip, element) {
  const elementRect = element.getBoundingClientRect();
  const preferredPosition = (element.dataset.position || "").split("|");
  const spacing = +element.dataset.spacing || DEFAULT_SPACING;
  const position = [...preferredPosition, ...POSITION_ORDER];

  for (let i = 0; i < POSITION_ORDER.length; i++) {
    const func = POSITION_TO_FUNCTION_MAP[position[i]];

    if (func && func(tooltip, elementRect, spacing)) return;
  }
};

///////////////////////////////////////////////////
///////////////////////////////////////////////////
addGlobalEventListener("mouseover", "[data-tooltip]", function (e) {
  // Show tooltip when hovered
  const tooltip = createTooltip(e.target.dataset.tooltip);
  tooltipContainer.append(tooltip);
  positionTooltip(tooltip, e.target);

  // Remove the tooltip when mouse moves off
  e.target.addEventListener("mouseleave", function () {
    tooltip.remove();
  });
});

// Show tooltip over the top of the element when hoverd
