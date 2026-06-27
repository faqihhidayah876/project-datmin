import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDFReport = async (results, audioFileName, t) => {
  const pdfContent = document.createElement('div');
  pdfContent.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 794px;
    background: #0F0A1A;
    color: white;
    font-family: 'Space Grotesk', sans-serif;
    padding: 40px;
    box-sizing: border-box;
    z-index: -1;
  `;

  const predictedClass = results.predictedClass || 'medium';
  const confidence = results.confidence || 0;
  const classColor = predictedClass === 'low' ? '#00D4AA' : predictedClass === 'medium' ? '#FFB347' : '#FF6B9D';
  const classLabel = predictedClass === 'low' ? t('low') : predictedClass === 'medium' ? t('medium') : t('high');
  const healthTips = t(`health_${predictedClass}_tips`) || [];

  pdfContent.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 28px; margin: 0 0 8px; background: linear-gradient(90deg, #A78BFA, #C4B5FD); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        ${t('pdf_title')}
      </h1>
      <p style="font-size: 12px; color: rgba(255,255,255,0.4); margin: 0;">
        ${t('pdf_generated')}: ${new Date().toLocaleString()}
      </p>
    </div>

    <div style="background: rgba(124,58,237,0.08); border: 1px solid rgba(167,139,250,0.15); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <p style="font-size: 11px; color: rgba(255,255,255,0.4); margin: 0 0 4px;">${t('pdf_patient')}</p>
          <p style="font-size: 14px; margin: 0; color: white;">#${Date.now().toString(36).toUpperCase()}</p>
        </div>
        <div style="text-align: right;">
          <p style="font-size: 11px; color: rgba(255,255,255,0.4); margin: 0 0 4px;">${t('pdf_model')}</p>
          <p style="font-size: 14px; margin: 0; color: white;">YAMNet + MLP CNN</p>
        </div>
      </div>
      
      <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 16px 0;"></div>
      
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <p style="font-size: 11px; color: rgba(255,255,255,0.4); margin: 0 0 4px;">${t('pdf_class')}</p>
          <p style="font-size: 20px; font-weight: bold; margin: 0; color: ${classColor};">${classLabel}</p>
        </div>
        <div style="text-align: right;">
          <p style="font-size: 11px; color: rgba(255,255,255,0.4); margin: 0 0 4px;">${t('pdf_confidence')}</p>
          <p style="font-size: 20px; font-weight: bold; margin: 0; color: #A78BFA;">${confidence.toFixed(2)}%</p>
        </div>
      </div>
    </div>

    <div style="background: rgba(124,58,237,0.05); border: 1px solid rgba(167,139,250,0.1); border-radius: 16px; padding: 20px; margin-bottom: 24px;">
      <h3 style="font-size: 14px; margin: 0 0 12px; color: white;">${t('pdf_features')}</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        ${Object.entries(results.features || {}).map(([key, val]) => `
          <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: rgba(255,255,255,0.03); border-radius: 8px;">
            <span style="font-size: 11px; color: rgba(255,255,255,0.5);">${t(`feature_${key}`) || key}</span>
            <span style="font-size: 11px; color: #A78BFA; font-weight: 600;">${val}%</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="background: rgba(124,58,237,0.05); border: 1px solid rgba(167,139,250,0.1); border-radius: 16px; padding: 20px; margin-bottom: 24px;">
      <h3 style="font-size: 14px; margin: 0 0 12px; color: white;">${t('pdf_recommendations')}</h3>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${Array.isArray(healthTips) ? healthTips.map((tip, i) => `
          <div style="display: flex; align-items: flex-start; gap: 8px; padding: 10px 12px; background: rgba(255,255,255,0.03); border-radius: 8px;">
            <span style="width: 18px; height: 18px; background: ${classColor}20; color: ${classColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; margin-top: 1px;">${i + 1}</span>
            <span style="font-size: 11px; color: rgba(255,255,255,0.7); line-height: 1.5;">${tip}</span>
          </div>
        `).join('') : ''}
      </div>
    </div>

    <div style="background: rgba(124,58,237,0.05); border: 1px solid rgba(167,139,250,0.1); border-radius: 16px; padding: 20px; margin-bottom: 24px;">
      <h3 style="font-size: 14px; margin: 0 0 12px; color: white;">Probability Distribution</h3>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${(results.probabilities || []).map(p => {
          const color = p.class === 'low' ? '#00D4AA' : p.class === 'medium' ? '#FFB347' : '#FF6B9D';
          return `
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase;">${p.class}</span>
                <span style="font-size: 11px; color: ${color}; font-weight: 600;">${p.probability.toFixed(2)}%</span>
              </div>
              <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                <div style="height: 100%; width: ${Math.min(p.probability, 100)}%; background: ${color}; border-radius: 3px;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
      <p style="font-size: 9px; color: rgba(255,255,255,0.3); text-align: center; margin: 0; line-height: 1.6;">
        ${t('pdf_disclaimer')}<br/>
        Audio File: ${audioFileName || 'N/A'} | Analysis ID: #${Date.now().toString(36).toUpperCase()}
      </p>
    </div>
  `;

  document.body.appendChild(pdfContent);

  try {
    const canvas = await html2canvas(pdfContent, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#0F0A1A',
      width: 794,
    });

    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [794, Math.max(1123, canvas.height)],
      hotfixes: ['px_scaling'],
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`fatigue-report-${Date.now()}.pdf`);

  } finally {
    document.body.removeChild(pdfContent);
  }
};

export default { generatePDFReport };