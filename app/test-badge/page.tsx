'use client';

import { Badge } from '@/components/atoms/Badge/Badge';

export default function TestBadgePage() {
  return (
    <div style={{ padding: '40px', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: 'bold' }}>
        🧪 Badge V6.0 Testing
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Test 1: Basic */}
        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>1. Basic Badge</h2>
          <Badge>Default Badge</Badge>
        </div>

        {/* Test 2: Border */}
        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>2. Border (2px solid blue)</h2>
          <Badge borderWidth={2} borderStyle="solid" borderColor="#3b82f6">
            With Border
          </Badge>
        </div>

        {/* Test 3: Dashed Border */}
        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>3. Dashed Border</h2>
          <Badge borderWidth={3} borderStyle="dashed" borderColor="#ef4444">
            Dashed Border
          </Badge>
        </div>

        {/* Test 4: Custom Colors + Border */}
        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>4. Custom Colors + Border</h2>
          <Badge
            color="#1e40af"
            backgroundColor="transparent"
            borderWidth={2}
            borderStyle="solid"
            borderColor="#3b82f6"
          >
            Outlined Custom
          </Badge>
        </div>

        {/* Test 5: Icon + Border */}
        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>5. Icon + Border</h2>
          <Badge icon="star" borderWidth={2} borderStyle="solid" borderColor="#10b981">
            Featured
          </Badge>
        </div>

        {/* Test 6: Check version attribute */}
        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>6. Version Check</h2>
          <p style={{ marginBottom: '10px' }}>Откройте DevTools и проверьте HTML - должен быть атрибут data-badge-version="6.0"</p>
          <Badge>Check Version</Badge>
        </div>
      </div>
    </div>
  );
}
