import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface VerificationCodeInputProps {
  onComplete: (code: string) => void;
  length?: number;
  className?: string;
}

export const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  onComplete,
  length = 6,
  className
}) => {
  const [codes, setCodes] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 检查是否所有输入框都已填写
  useEffect(() => {
    const completeCode = codes.join('');
    if (completeCode.length === length && !codes.includes('')) {
      onComplete(completeCode);
    }
  }, [codes, length, onComplete]);

  // 处理输入变化
  const handleChange = (value: string, index: number) => {
    // 只允许数字输入
    if (!/^\d*$/.test(value)) return;

    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // 输入后自动聚焦到下一个输入框
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // 处理删除键
    if (e.key === 'Backspace' && !codes[index]) {
      // 当前输入框为空时，删除前一个输入框内容并聚焦
      if (index > 0) {
        const newCodes = [...codes];
        newCodes[index - 1] = '';
        setCodes(newCodes);
        inputRefs.current[index - 1]?.focus();
      }
      e.preventDefault();
    }

    // 处理箭头键导航
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 处理粘贴事件
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/[^\d]/g, '');
    
    if (pastedText) {
      const newCodes = [...codes];
      
      for (let i = 0; i < pastedText.length && index + i < length; i++) {
        newCodes[index + i] = pastedText[i];
      }
      
      setCodes(newCodes);
      
      // 聚焦到最后一个被填充的输入框的下一个
      const lastPastedIndex = Math.min(index + pastedText.length, length) - 1;
      if (lastPastedIndex < length - 1) {
        setTimeout(() => {
          inputRefs.current[lastPastedIndex + 1]?.focus();
        }, 0);
      }
    }
  };

  return (
    <div 
      className={cn(
        'flex gap-2 justify-center items-center',
        'sm:gap-3',
        className
      )}
    >
      {codes.map((code, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength={1}
          value={code}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={(e) => handlePaste(e, index)}
          className={cn(
            'w-12 h-14 flex items-center justify-center text-xl font-semibold text-center',
            'sm:w-14 sm:h-16 sm:text-2xl',
            'border rounded-lg transition-all duration-200',
            'bg-background border-input focus:border-primary focus:ring-2 focus:ring-primary/20',
            'focus:outline-none focus:ring-offset-0',
            'dark:bg-background dark:border-input',
            'data-[focus]:border-primary data-[focus]:ring-2 data-[focus]:ring-primary/20'
          )}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};