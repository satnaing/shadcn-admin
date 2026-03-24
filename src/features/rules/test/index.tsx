import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Copy, Play, ArrowLeft } from 'lucide-react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/stores/auth-store'
import { runRule } from '../versions/api'

type Language = 'shell' | 'javascript' | 'node' | 'python' | 'php' | 'go' | 'java'

export function RuleTest() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/_authenticated/rules/test' }) as any
  const user = useAuthStore((s) => s.auth.user)

  const [userId, setUserId] = useState(user?.user_id || '')
  const [userKey, setUserKey] = useState(user?.user_key || '')
  const [projId, setProjId] = useState(search?.projId || '')
  const [data, setData] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentLang, setCurrentLang] = useState<Language>('shell')
  const [codeSnippet, setCodeSnippet] = useState('')

  const baseUrl = import.meta.env.VITE_API_BASE_URL + '/geerule'

  const languages = [
    { value: 'shell' as Language, label: 'Shell' },
    { value: 'javascript' as Language, label: 'JavaScript' },
    { value: 'node' as Language, label: 'Node' },
    { value: 'python' as Language, label: 'Python' },
    { value: 'php' as Language, label: 'PHP' },
    { value: 'go' as Language, label: 'Go' },
    { value: 'java' as Language, label: 'Java' },
  ]

  useEffect(() => {
    if (user?.user_id) setUserId(user.user_id)
    if (user?.user_key) setUserKey(user.user_key)
  }, [user])

  useEffect(() => {
    generateCode()
  }, [userId, userKey, projId, data, currentLang])

  const generateCode = () => {
    const url = `${baseUrl}/run?user_id=${userId}&user_key=${userKey}&proj_id=${projId}`
    const jsonData = data || '{}'

    switch (currentLang) {
      case 'shell':
        setCodeSnippet(`curl -X 'POST' \\
  '${url}' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -d '${jsonData}'`)
        break

      case 'javascript':
        setCodeSnippet(`fetch('${url}', {
  method: 'POST',
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: '${jsonData}'
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error))`)
        break

      case 'node':
        setCodeSnippet(`const https = require('https')

const data = JSON.stringify(${jsonData})

const options = {
  method: 'POST',
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

const req = https.request('${url}', options, (res) => {
  let body = ''
  res.on('data', (chunk) => body += chunk)
  res.on('end', () => console.log(JSON.parse(body)))
})

req.on('error', (error) => console.error(error))
req.write(data)
req.end()`)
        break

      case 'python':
        setCodeSnippet(`import requests
import json

url = '${url}'
headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json'
}
data = ${jsonData}

response = requests.post(url, headers=headers, json=data)
print(response.json())`)
        break

      case 'php':
        setCodeSnippet(`<?php
$url = '${url}';
$data = json_encode(${jsonData});

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'accept: application/json',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`)
        break

      case 'go':
        setCodeSnippet(`package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

func main() {
    url := "${url}"
    data := []byte(\`${jsonData}\`)

    req, _ := http.NewRequest("POST", url, bytes.NewBuffer(data))
    req.Header.Set("accept", "application/json")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}`)
        break

      case 'java':
        setCodeSnippet(`import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Main {
    public static void main(String[] args) throws Exception {
        String url = "${url}";
        String json = "${jsonData}";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("accept", "application/json")
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json))
            .build();

        HttpResponse<String> response = client.send(request,
            HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}`)
        break
    }
  }

  const handleTest = async () => {
    if (!userId || !userKey || !projId || !data) {
      toast.error('请填写所有必填字段')
      return
    }

    setLoading(true)
    try {
      const parsedData = JSON.parse(data)
      const result = await runRule({ user_id: userId, user_key: userKey, proj_id: projId }, parsedData)
      setResponse(JSON.stringify(result, null, 2))
      toast.success('测试成功')
    } catch (error) {
      setResponse('请检查输入参数是否符合规范')
      toast.error('测试失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板')
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={() => navigate({ to: '/rules/versions' })}>
          <ArrowLeft className='size-4' />
        </Button>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>业务调用 API</h1>
          <p className='mt-2 text-muted-foreground'>测试规则接口调用</p>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>接口信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <span className='px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium'>POST</span>
                <span className='text-sm font-mono'>{baseUrl}/run</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>请求参数</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label htmlFor='user_id'>user_id *</Label>
                <Input id='user_id' value={userId} onChange={(e) => setUserId(e.target.value)} />
              </div>
              <div>
                <Label htmlFor='user_key'>user_key *</Label>
                <Input id='user_key' value={userKey} onChange={(e) => setUserKey(e.target.value)} />
              </div>
              <div>
                <Label htmlFor='proj_id'>proj_id *</Label>
                <Input id='proj_id' value={projId} onChange={(e) => setProjId(e.target.value)} />
              </div>
              <div>
                <Label htmlFor='data'>请求体 (JSON) *</Label>
                <Textarea
                  id='data'
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  rows={8}
                  placeholder='{"key": "value"}'
                  className='font-mono text-sm'
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>代码示例</CardTitle>
                <Button size='sm' variant='ghost' onClick={() => handleCopy(codeSnippet)}>
                  <Copy className='mr-2 size-4' />
                  复制
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={currentLang} onValueChange={(v) => setCurrentLang(v as Language)}>
                <TabsList className='mb-4 flex-wrap h-auto'>
                  {languages.map((lang) => (
                    <TabsTrigger key={lang.value} value={lang.value}>
                      {lang.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value={currentLang}>
                  <pre className='bg-slate-900 text-slate-50 p-4 rounded-md text-xs overflow-x-auto max-h-80'>
                    {codeSnippet}
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>响应结果</CardTitle>
                <Button onClick={handleTest} disabled={loading}>
                  <Play className='mr-2 size-4' />
                  {loading ? '测试中...' : '测试'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {response ? (
                <pre className='bg-slate-50 p-4 rounded-md text-xs overflow-x-auto border max-h-96'>
                  {response}
                </pre>
              ) : (
                <div className='text-center py-8 text-muted-foreground text-sm'>
                  点击测试按钮查看响应结果
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
