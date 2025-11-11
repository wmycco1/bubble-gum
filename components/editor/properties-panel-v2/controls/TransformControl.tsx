'use client';

/**
 * TransformControl - Rotation, Scale & Transition controls (V3.0)
 *
 * Features:
 * - Rotation with external ↑↓ buttons
 * - Scale (uniform or individual X/Y) with external ↑↓ buttons
 * - Transition Duration with external ↑↓ buttons
 * - Simple/Advanced mode toggle
 * - Visual preview indicators
 * - Hold-to-repeat with acceleration (100ms → 20ms)
 * - Centralized button placement (NO internal controls)
 *
 * V3.0 Changes:
 * - REPLACED: All internal controls with external ↑↓ buttons
 * - ADDED: Hold-to-repeat to ALL fields (Rotation, Scale X/Y, Transition)
 * - FIXED: Centralized layout (buttons aligned on right)
 * - ADDED: Transition Duration field
 *
 * Button Layout:
 * [Input Field ↑↓] [Range Display]
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TransformControlProps {
  label: string;
  // Rotation (number, e.g., 45 means 45 degrees)
  rotate?: number;
  // Scale (numbers, e.g., 1.5 means 150%)
  scaleX?: number;
  scaleY?: number;
  // Transition Duration (milliseconds)
  transitionDuration?: number;
  // Callbacks
  onChange: (name: string, value: number | undefined) => void;
  description?: string;
}

export function TransformControl({
  label,
  rotate,
  scaleX,
  scaleY,
  transitionDuration,
  onChange,
  description,
}: TransformControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Use provided values or defaults
  const rotateValue = rotate ?? 0;
  const scaleXValue = scaleX ?? 1;
  const scaleYValue = scaleY ?? 1;
  const transitionValue = transitionDuration ?? 300;

  // For simple mode, show uniform scale (average of X and Y)
  const uniformScaleValue = scaleX !== undefined || scaleY !== undefined
    ? (scaleXValue + scaleYValue) / 2
    : 1;

  // ==================== ROTATION CONTROLS ====================
  const [isRotateIncPressed, setIsRotateIncPressed] = useState(false);
  const [isRotateDecPressed, setIsRotateDecPressed] = useState(false);
  const rotateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const rotateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rotateSpeedRef = useRef(100);
  const rotateValueRef = useRef(rotateValue);

  useEffect(() => {
    rotateValueRef.current = rotateValue;
  }, [rotateValue]);

  const handleRotateIncrement = useCallback(() => {
    const currentValue = rotateValueRef.current || 0;
    const newValue = Math.min(360, currentValue + 1);
    onChange('rotate', newValue);
    rotateValueRef.current = newValue;
  }, [onChange]);

  const handleRotateDecrement = useCallback(() => {
    const currentValue = rotateValueRef.current || 0;
    const newValue = Math.max(-360, currentValue - 1);
    onChange('rotate', newValue);
    rotateValueRef.current = newValue;
  }, [onChange]);

  const startRotateIncrement = () => {
    setIsRotateIncPressed(true);
    handleRotateIncrement();
    rotateSpeedRef.current = 100;
    rotateTimeoutRef.current = setTimeout(() => {
      rotateIntervalRef.current = setInterval(() => {
        handleRotateIncrement();
        if (rotateSpeedRef.current > 20) {
          rotateSpeedRef.current = Math.max(20, rotateSpeedRef.current - 10);
          if (rotateIntervalRef.current) clearInterval(rotateIntervalRef.current);
          rotateIntervalRef.current = setInterval(handleRotateIncrement, rotateSpeedRef.current);
        }
      }, rotateSpeedRef.current);
    }, 200);
  };

  const startRotateDecrement = () => {
    setIsRotateDecPressed(true);
    handleRotateDecrement();
    rotateSpeedRef.current = 100;
    rotateTimeoutRef.current = setTimeout(() => {
      rotateIntervalRef.current = setInterval(() => {
        handleRotateDecrement();
        if (rotateSpeedRef.current > 20) {
          rotateSpeedRef.current = Math.max(20, rotateSpeedRef.current - 10);
          if (rotateIntervalRef.current) clearInterval(rotateIntervalRef.current);
          rotateIntervalRef.current = setInterval(handleRotateDecrement, rotateSpeedRef.current);
        }
      }, rotateSpeedRef.current);
    }, 200);
  };

  const stopRotateChange = () => {
    setIsRotateIncPressed(false);
    setIsRotateDecPressed(false);
    if (rotateIntervalRef.current) {
      clearInterval(rotateIntervalRef.current);
      rotateIntervalRef.current = null;
    }
    if (rotateTimeoutRef.current) {
      clearTimeout(rotateTimeoutRef.current);
      rotateTimeoutRef.current = null;
    }
    rotateSpeedRef.current = 100;
  };

  // ==================== UNIFORM SCALE CONTROLS ====================
  const [isUniformScaleIncPressed, setIsUniformScaleIncPressed] = useState(false);
  const [isUniformScaleDecPressed, setIsUniformScaleDecPressed] = useState(false);
  const uniformScaleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const uniformScaleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const uniformScaleSpeedRef = useRef(100);
  const uniformScaleValueRef = useRef(uniformScaleValue);

  useEffect(() => {
    uniformScaleValueRef.current = uniformScaleValue;
  }, [uniformScaleValue]);

  const handleUniformScaleIncrement = useCallback(() => {
    const currentValue = uniformScaleValueRef.current || 1;
    const newValue = Math.min(10, currentValue + 0.1);
    onChange('scaleX', newValue);
    onChange('scaleY', newValue);
    uniformScaleValueRef.current = newValue;
  }, [onChange]);

  const handleUniformScaleDecrement = useCallback(() => {
    const currentValue = uniformScaleValueRef.current || 1;
    const newValue = Math.max(0, currentValue - 0.1);
    onChange('scaleX', newValue);
    onChange('scaleY', newValue);
    uniformScaleValueRef.current = newValue;
  }, [onChange]);

  const startUniformScaleIncrement = () => {
    setIsUniformScaleIncPressed(true);
    handleUniformScaleIncrement();
    uniformScaleSpeedRef.current = 100;
    uniformScaleTimeoutRef.current = setTimeout(() => {
      uniformScaleIntervalRef.current = setInterval(() => {
        handleUniformScaleIncrement();
        if (uniformScaleSpeedRef.current > 20) {
          uniformScaleSpeedRef.current = Math.max(20, uniformScaleSpeedRef.current - 10);
          if (uniformScaleIntervalRef.current) clearInterval(uniformScaleIntervalRef.current);
          uniformScaleIntervalRef.current = setInterval(handleUniformScaleIncrement, uniformScaleSpeedRef.current);
        }
      }, uniformScaleSpeedRef.current);
    }, 200);
  };

  const startUniformScaleDecrement = () => {
    setIsUniformScaleDecPressed(true);
    handleUniformScaleDecrement();
    uniformScaleSpeedRef.current = 100;
    uniformScaleTimeoutRef.current = setTimeout(() => {
      uniformScaleIntervalRef.current = setInterval(() => {
        handleUniformScaleDecrement();
        if (uniformScaleSpeedRef.current > 20) {
          uniformScaleSpeedRef.current = Math.max(20, uniformScaleSpeedRef.current - 10);
          if (uniformScaleIntervalRef.current) clearInterval(uniformScaleIntervalRef.current);
          uniformScaleIntervalRef.current = setInterval(handleUniformScaleDecrement, uniformScaleSpeedRef.current);
        }
      }, uniformScaleSpeedRef.current);
    }, 200);
  };

  const stopUniformScaleChange = () => {
    setIsUniformScaleIncPressed(false);
    setIsUniformScaleDecPressed(false);
    if (uniformScaleIntervalRef.current) {
      clearInterval(uniformScaleIntervalRef.current);
      uniformScaleIntervalRef.current = null;
    }
    if (uniformScaleTimeoutRef.current) {
      clearTimeout(uniformScaleTimeoutRef.current);
      uniformScaleTimeoutRef.current = null;
    }
    uniformScaleSpeedRef.current = 100;
  };

  // ==================== SCALE X CONTROLS ====================
  const [isScaleXIncPressed, setIsScaleXIncPressed] = useState(false);
  const [isScaleXDecPressed, setIsScaleXDecPressed] = useState(false);
  const scaleXIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scaleXTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scaleXSpeedRef = useRef(100);
  const scaleXValueRefState = useRef(scaleXValue);

  useEffect(() => {
    scaleXValueRefState.current = scaleXValue;
  }, [scaleXValue]);

  const handleScaleXIncrement = useCallback(() => {
    const currentValue = scaleXValueRefState.current || 1;
    const newValue = Math.min(10, currentValue + 0.1);
    onChange('scaleX', newValue);
    scaleXValueRefState.current = newValue;
  }, [onChange]);

  const handleScaleXDecrement = useCallback(() => {
    const currentValue = scaleXValueRefState.current || 1;
    const newValue = Math.max(0, currentValue - 0.1);
    onChange('scaleX', newValue);
    scaleXValueRefState.current = newValue;
  }, [onChange]);

  const startScaleXIncrement = () => {
    setIsScaleXIncPressed(true);
    handleScaleXIncrement();
    scaleXSpeedRef.current = 100;
    scaleXTimeoutRef.current = setTimeout(() => {
      scaleXIntervalRef.current = setInterval(() => {
        handleScaleXIncrement();
        if (scaleXSpeedRef.current > 20) {
          scaleXSpeedRef.current = Math.max(20, scaleXSpeedRef.current - 10);
          if (scaleXIntervalRef.current) clearInterval(scaleXIntervalRef.current);
          scaleXIntervalRef.current = setInterval(handleScaleXIncrement, scaleXSpeedRef.current);
        }
      }, scaleXSpeedRef.current);
    }, 200);
  };

  const startScaleXDecrement = () => {
    setIsScaleXDecPressed(true);
    handleScaleXDecrement();
    scaleXSpeedRef.current = 100;
    scaleXTimeoutRef.current = setTimeout(() => {
      scaleXIntervalRef.current = setInterval(() => {
        handleScaleXDecrement();
        if (scaleXSpeedRef.current > 20) {
          scaleXSpeedRef.current = Math.max(20, scaleXSpeedRef.current - 10);
          if (scaleXIntervalRef.current) clearInterval(scaleXIntervalRef.current);
          scaleXIntervalRef.current = setInterval(handleScaleXDecrement, scaleXSpeedRef.current);
        }
      }, scaleXSpeedRef.current);
    }, 200);
  };

  const stopScaleXChange = () => {
    setIsScaleXIncPressed(false);
    setIsScaleXDecPressed(false);
    if (scaleXIntervalRef.current) {
      clearInterval(scaleXIntervalRef.current);
      scaleXIntervalRef.current = null;
    }
    if (scaleXTimeoutRef.current) {
      clearTimeout(scaleXTimeoutRef.current);
      scaleXTimeoutRef.current = null;
    }
    scaleXSpeedRef.current = 100;
  };

  // ==================== SCALE Y CONTROLS ====================
  const [isScaleYIncPressed, setIsScaleYIncPressed] = useState(false);
  const [isScaleYDecPressed, setIsScaleYDecPressed] = useState(false);
  const scaleYIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scaleYTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scaleYSpeedRef = useRef(100);
  const scaleYValueRefState = useRef(scaleYValue);

  useEffect(() => {
    scaleYValueRefState.current = scaleYValue;
  }, [scaleYValue]);

  const handleScaleYIncrement = useCallback(() => {
    const currentValue = scaleYValueRefState.current || 1;
    const newValue = Math.min(10, currentValue + 0.1);
    onChange('scaleY', newValue);
    scaleYValueRefState.current = newValue;
  }, [onChange]);

  const handleScaleYDecrement = useCallback(() => {
    const currentValue = scaleYValueRefState.current || 1;
    const newValue = Math.max(0, currentValue - 0.1);
    onChange('scaleY', newValue);
    scaleYValueRefState.current = newValue;
  }, [onChange]);

  const startScaleYIncrement = () => {
    setIsScaleYIncPressed(true);
    handleScaleYIncrement();
    scaleYSpeedRef.current = 100;
    scaleYTimeoutRef.current = setTimeout(() => {
      scaleYIntervalRef.current = setInterval(() => {
        handleScaleYIncrement();
        if (scaleYSpeedRef.current > 20) {
          scaleYSpeedRef.current = Math.max(20, scaleYSpeedRef.current - 10);
          if (scaleYIntervalRef.current) clearInterval(scaleYIntervalRef.current);
          scaleYIntervalRef.current = setInterval(handleScaleYIncrement, scaleYSpeedRef.current);
        }
      }, scaleYSpeedRef.current);
    }, 200);
  };

  const startScaleYDecrement = () => {
    setIsScaleYDecPressed(true);
    handleScaleYDecrement();
    scaleYSpeedRef.current = 100;
    scaleYTimeoutRef.current = setTimeout(() => {
      scaleYIntervalRef.current = setInterval(() => {
        handleScaleYDecrement();
        if (scaleYSpeedRef.current > 20) {
          scaleYSpeedRef.current = Math.max(20, scaleYSpeedRef.current - 10);
          if (scaleYIntervalRef.current) clearInterval(scaleYIntervalRef.current);
          scaleYIntervalRef.current = setInterval(handleScaleYDecrement, scaleYSpeedRef.current);
        }
      }, scaleYSpeedRef.current);
    }, 200);
  };

  const stopScaleYChange = () => {
    setIsScaleYIncPressed(false);
    setIsScaleYDecPressed(false);
    if (scaleYIntervalRef.current) {
      clearInterval(scaleYIntervalRef.current);
      scaleYIntervalRef.current = null;
    }
    if (scaleYTimeoutRef.current) {
      clearTimeout(scaleYTimeoutRef.current);
      scaleYTimeoutRef.current = null;
    }
    scaleYSpeedRef.current = 100;
  };

  // ==================== TRANSITION CONTROLS ====================
  const [isTransitionIncPressed, setIsTransitionIncPressed] = useState(false);
  const [isTransitionDecPressed, setIsTransitionDecPressed] = useState(false);
  const transitionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transitionSpeedRef = useRef(100);
  const transitionValueRef = useRef(transitionValue);

  useEffect(() => {
    transitionValueRef.current = transitionValue;
  }, [transitionValue]);

  const handleTransitionIncrement = useCallback(() => {
    const currentValue = transitionValueRef.current || 0;
    const newValue = Math.min(5000, currentValue + 50);
    onChange('transitionDuration', newValue);
    transitionValueRef.current = newValue;
  }, [onChange]);

  const handleTransitionDecrement = useCallback(() => {
    const currentValue = transitionValueRef.current || 0;
    const newValue = Math.max(0, currentValue - 50);
    onChange('transitionDuration', newValue);
    transitionValueRef.current = newValue;
  }, [onChange]);

  const startTransitionIncrement = () => {
    setIsTransitionIncPressed(true);
    handleTransitionIncrement();
    transitionSpeedRef.current = 100;
    transitionTimeoutRef.current = setTimeout(() => {
      transitionIntervalRef.current = setInterval(() => {
        handleTransitionIncrement();
        if (transitionSpeedRef.current > 20) {
          transitionSpeedRef.current = Math.max(20, transitionSpeedRef.current - 10);
          if (transitionIntervalRef.current) clearInterval(transitionIntervalRef.current);
          transitionIntervalRef.current = setInterval(handleTransitionIncrement, transitionSpeedRef.current);
        }
      }, transitionSpeedRef.current);
    }, 200);
  };

  const startTransitionDecrement = () => {
    setIsTransitionDecPressed(true);
    handleTransitionDecrement();
    transitionSpeedRef.current = 100;
    transitionTimeoutRef.current = setTimeout(() => {
      transitionIntervalRef.current = setInterval(() => {
        handleTransitionDecrement();
        if (transitionSpeedRef.current > 20) {
          transitionSpeedRef.current = Math.max(20, transitionSpeedRef.current - 10);
          if (transitionIntervalRef.current) clearInterval(transitionIntervalRef.current);
          transitionIntervalRef.current = setInterval(handleTransitionDecrement, transitionSpeedRef.current);
        }
      }, transitionSpeedRef.current);
    }, 200);
  };

  const stopTransitionChange = () => {
    setIsTransitionIncPressed(false);
    setIsTransitionDecPressed(false);
    if (transitionIntervalRef.current) {
      clearInterval(transitionIntervalRef.current);
      transitionIntervalRef.current = null;
    }
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    transitionSpeedRef.current = 100;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rotateIntervalRef.current) clearInterval(rotateIntervalRef.current);
      if (rotateTimeoutRef.current) clearTimeout(rotateTimeoutRef.current);
      if (uniformScaleIntervalRef.current) clearInterval(uniformScaleIntervalRef.current);
      if (uniformScaleTimeoutRef.current) clearTimeout(uniformScaleTimeoutRef.current);
      if (scaleXIntervalRef.current) clearInterval(scaleXIntervalRef.current);
      if (scaleXTimeoutRef.current) clearTimeout(scaleXTimeoutRef.current);
      if (scaleYIntervalRef.current) clearInterval(scaleYIntervalRef.current);
      if (scaleYTimeoutRef.current) clearTimeout(scaleYTimeoutRef.current);
      if (transitionIntervalRef.current) clearInterval(transitionIntervalRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  const handleRotateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange('rotate', value === '' ? undefined : parseFloat(value));
  };

  const handleUniformScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value === '' ? undefined : parseFloat(value);
    onChange('scaleX', numValue);
    onChange('scaleY', numValue);
  };

  const handleScaleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange('scaleX', value === '' ? undefined : parseFloat(value));
  };

  const handleScaleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange('scaleY', value === '' ? undefined : parseFloat(value));
  };

  const handleTransitionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange('transitionDuration', value === '' ? undefined : parseFloat(value));
  };

  return (
    <div className="mb-4">
      {/* Label & Expand Button */}
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {description && (
            <span className="block text-xs text-gray-500 font-normal mt-0.5">
              {description}
            </span>
          )}
        </label>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          {isExpanded ? 'Simple' : 'Advanced'}
        </button>
      </div>

      {/* Simple Mode */}
      {!isExpanded && (
        <div className="space-y-3">
          {/* Rotation */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Rotation (°)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="-360"
                max="360"
                step="1"
                value={rotateValue}
                onChange={handleRotateChange}
                placeholder="0"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{ MozAppearance: 'textfield' }}
              />
              <div className="flex flex-col gap-0.5 items-center">
                <button
                  type="button"
                  onMouseDown={startRotateIncrement}
                  onMouseUp={stopRotateChange}
                  onMouseLeave={stopRotateChange}
                  onTouchStart={startRotateIncrement}
                  onTouchEnd={stopRotateChange}
                  disabled={rotateValue >= 360}
                  className={`
                    p-1.5 border-2 rounded-md transition-all shadow-sm
                    ${isRotateIncPressed && rotateValue < 360
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                    }
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300
                  `}
                  title="Increment (hold to repeat)"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onMouseDown={startRotateDecrement}
                  onMouseUp={stopRotateChange}
                  onMouseLeave={stopRotateChange}
                  onTouchStart={startRotateDecrement}
                  onTouchEnd={stopRotateChange}
                  disabled={rotateValue <= -360}
                  className={`
                    p-1.5 border-2 rounded-md transition-all shadow-sm
                    ${isRotateDecPressed && rotateValue > -360
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                    }
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300
                  `}
                  title="Decrement (hold to repeat)"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-400 min-w-[60px] text-right">-360-360°</div>
            </div>
          </div>

          {/* Uniform Scale */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Scale (×)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={uniformScaleValue.toFixed(1)}
                onChange={handleUniformScaleChange}
                placeholder="1"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{ MozAppearance: 'textfield' }}
              />
              <div className="flex flex-col gap-0.5 items-center">
                <button
                  type="button"
                  onMouseDown={startUniformScaleIncrement}
                  onMouseUp={stopUniformScaleChange}
                  onMouseLeave={stopUniformScaleChange}
                  onTouchStart={startUniformScaleIncrement}
                  onTouchEnd={stopUniformScaleChange}
                  disabled={uniformScaleValue >= 10}
                  className={`
                    p-1.5 border-2 rounded-md transition-all shadow-sm
                    ${isUniformScaleIncPressed && uniformScaleValue < 10
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                    }
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300
                  `}
                  title="Increment (hold to repeat)"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onMouseDown={startUniformScaleDecrement}
                  onMouseUp={stopUniformScaleChange}
                  onMouseLeave={stopUniformScaleChange}
                  onTouchStart={startUniformScaleDecrement}
                  onTouchEnd={stopUniformScaleChange}
                  disabled={uniformScaleValue <= 0}
                  className={`
                    p-1.5 border-2 rounded-md transition-all shadow-sm
                    ${isUniformScaleDecPressed && uniformScaleValue > 0
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                    }
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300
                  `}
                  title="Decrement (hold to repeat)"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-400 min-w-[60px] text-right">0-10×</div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Mode */}
      {isExpanded && (
        <div className="space-y-3">
          {/* Rotation + Scale X in one row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Rotation */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Rotation (°)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="-360"
                  max="360"
                  step="1"
                  value={rotateValue}
                  onChange={handleRotateChange}
                  placeholder="0"
                  className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ MozAppearance: 'textfield' }}
                />
                <div className="flex flex-col gap-0.5 items-center">
                  <button
                    type="button"
                    onMouseDown={startRotateIncrement}
                    onMouseUp={stopRotateChange}
                    onMouseLeave={stopRotateChange}
                    onTouchStart={startRotateIncrement}
                    onTouchEnd={stopRotateChange}
                    disabled={rotateValue >= 360}
                    className={`
                      p-1 border-2 rounded transition-all shadow-sm
                      ${isRotateIncPressed && rotateValue < 360
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                      }
                      disabled:opacity-40 disabled:cursor-not-allowed
                    `}
                    title="Increment"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onMouseDown={startRotateDecrement}
                    onMouseUp={stopRotateChange}
                    onMouseLeave={stopRotateChange}
                    onTouchStart={startRotateDecrement}
                    onTouchEnd={stopRotateChange}
                    disabled={rotateValue <= -360}
                    className={`
                      p-1 border-2 rounded transition-all shadow-sm
                      ${isRotateDecPressed && rotateValue > -360
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                      }
                      disabled:opacity-40 disabled:cursor-not-allowed
                    `}
                    title="Decrement"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Scale X */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Scale X</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={scaleXValue.toFixed(1)}
                  onChange={handleScaleXChange}
                  placeholder="1"
                  className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ MozAppearance: 'textfield' }}
                />
                <div className="flex flex-col gap-0.5 items-center">
                  <button
                    type="button"
                    onMouseDown={startScaleXIncrement}
                    onMouseUp={stopScaleXChange}
                    onMouseLeave={stopScaleXChange}
                    onTouchStart={startScaleXIncrement}
                    onTouchEnd={stopScaleXChange}
                    disabled={scaleXValue >= 10}
                    className={`
                      p-1 border-2 rounded transition-all shadow-sm
                      ${isScaleXIncPressed && scaleXValue < 10
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                      }
                      disabled:opacity-40 disabled:cursor-not-allowed
                    `}
                    title="Increment"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onMouseDown={startScaleXDecrement}
                    onMouseUp={stopScaleXChange}
                    onMouseLeave={stopScaleXChange}
                    onTouchStart={startScaleXDecrement}
                    onTouchEnd={stopScaleXChange}
                    disabled={scaleXValue <= 0}
                    className={`
                      p-1 border-2 rounded transition-all shadow-sm
                      ${isScaleXDecPressed && scaleXValue > 0
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                      }
                      disabled:opacity-40 disabled:cursor-not-allowed
                    `}
                    title="Decrement"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scale Y + Transition Duration in one row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Scale Y */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Scale Y</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={scaleYValue.toFixed(1)}
                  onChange={handleScaleYChange}
                  placeholder="1"
                  className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ MozAppearance: 'textfield' }}
                />
                <div className="flex flex-col gap-0.5 items-center">
                  <button
                    type="button"
                    onMouseDown={startScaleYIncrement}
                    onMouseUp={stopScaleYChange}
                    onMouseLeave={stopScaleYChange}
                    onTouchStart={startScaleYIncrement}
                    onTouchEnd={stopScaleYChange}
                    disabled={scaleYValue >= 10}
                    className={`
                      p-1 border-2 rounded transition-all shadow-sm
                      ${isScaleYIncPressed && scaleYValue < 10
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                      }
                      disabled:opacity-40 disabled:cursor-not-allowed
                    `}
                    title="Increment"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onMouseDown={startScaleYDecrement}
                    onMouseUp={stopScaleYChange}
                    onMouseLeave={stopScaleYChange}
                    onTouchStart={startScaleYDecrement}
                    onTouchEnd={stopScaleYChange}
                    disabled={scaleYValue <= 0}
                    className={`
                      p-1 border-2 rounded transition-all shadow-sm
                      ${isScaleYDecPressed && scaleYValue > 0
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                      }
                      disabled:opacity-40 disabled:cursor-not-allowed
                    `}
                    title="Decrement"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Transition Duration */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Transition Duration (ms)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="5000"
                  step="50"
                  value={transitionValue}
                  onChange={handleTransitionChange}
                  placeholder="300"
                  className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ MozAppearance: 'textfield' }}
                />
                <div className="flex flex-col gap-0.5 items-center">
                  <button
                    type="button"
                    onMouseDown={startTransitionIncrement}
                    onMouseUp={stopTransitionChange}
                    onMouseLeave={stopTransitionChange}
                    onTouchStart={startTransitionIncrement}
                    onTouchEnd={stopTransitionChange}
                    disabled={transitionValue >= 5000}
                    className={`
                      p-1 border-2 rounded-md transition-all shadow-sm
                      ${isTransitionIncPressed && transitionValue < 5000
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                      }
                      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300
                    `}
                    title="Increment (hold to repeat)"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onMouseDown={startTransitionDecrement}
                    onMouseUp={stopTransitionChange}
                    onMouseLeave={stopTransitionChange}
                    onTouchStart={startTransitionDecrement}
                    onTouchEnd={stopTransitionChange}
                    disabled={transitionValue <= 0}
                    className={`
                      p-1 border-2 rounded-md transition-all shadow-sm
                      ${isTransitionDecPressed && transitionValue > 0
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                      }
                      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300
                    `}
                    title="Decrement (hold to repeat)"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Preview */}
          <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
            <div className="text-xs text-gray-600 mb-2 text-center">Preview (no transition)</div>
            <div className="flex items-center justify-center h-24">
              <div
                className="w-16 h-16 bg-blue-500 rounded flex items-center justify-center text-white font-bold"
                style={{
                  transform: `rotate(${rotateValue}deg) scale(${scaleXValue}, ${scaleYValue})`,
                }}
              >
                T
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
